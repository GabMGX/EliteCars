#! ".venv\Scripts\python.exe"

from flask import Flask, Response, send_from_directory
from collections import defaultdict
import os
import re


app = Flask(__name__, static_folder='static')
app.images_folder = os.path.join(app.static_folder, 'images')
app.components_folder = "./components"


@app.route('/favicon.svg')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.svg', mimetype='image/svg+xml')


@app.route('/components.js')
def components():
    components = defaultdict(dict)

    for name in os.listdir(app.components_folder):
        base, ext = os.path.splitext(name)
        ext = ext.lstrip('.')
        components[base][ext] = name

    final = ''
    for base, files in components.items():
        js_path = files.get('js')
        html_path = files.get('html')
        css_path = files.get('css')

        if not js_path:
            continue

        with open(os.path.join(app.components_folder, js_path), encoding='utf-8') as f:
            js = f.read()
        
        html = css = ''
        if html_path:
            with open(os.path.join(app.components_folder, html_path)) as f:
                html = f.read()
        if css_path:
            with open(os.path.join(app.components_folder, css_path)) as f:
                css = f.read()
        
        # Substitui o conteúdo entre os crases de this.shadowRoot.innerHTML
        pattern = r"(this\.shadowRoot\.innerHTML\s*=\s*)`.*?`"
        replacement_html = f"\\1`<style>{css}</style>{html}`"
        js = re.sub(pattern, replacement_html, js, flags=re.DOTALL)

        final += js + '\n\n'

    return Response(final, mimetype='application/javascript')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def spa(path):
    return send_from_directory(app.static_folder, 'base.html')


if __name__ == "__main__":
    app.run(debug=True)