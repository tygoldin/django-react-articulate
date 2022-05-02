# django-react-articulate
ARTiculate - Visualization application for artworks

Running Locally:

Setting up the Backend:

* Make sure django and pipenv are installed *
```bash
  pip install django
  pip install pipenv
```
and a few modules needed
```bash
  pipenv install djangorestframework django-cors-headers
```

In the root directory
```bash
  pipenv shell # should start django virtual environment
```

then
```bash
  pip install -r requirements.txt
```

Note: If having trouble installing mysqlclient, run
```bash
  sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
```

then 
```bash
  python manage.py runserver
```

Check if working at http://localhost:8000/api/

Setting up the Frontend:

* Make sure node is installed *

In frontend directory

```bash
  npm install
```
then run

```bash
  npm start
```

Check if working at http://localhost:3000/
