import dash
from dash import html
import psycopg2

# Establecer la conexión a la base de datos PostgreSQL
conn = psycopg2.connect(
    host='langosta.ing.puc.cl',
    port=5432,
    user='cseverinr@uc.cl',
    password='19637918',
    database='cseverinr@uc.cl'
)

# Crear una instancia de la aplicación Dash
app = dash.Dash(__name__)

##app.index_string = open('index.html').read()

# Definir el diseño del dashboard
app.layout = html.Div(
    children=[
        html.H1("Ejemplo de Dashboard con Dash y PostgreSQL"),
        # Agrega más componentes Dash aquí
    ]
)

if __name__ == '__main__':
    app.run_server(debug=True)
