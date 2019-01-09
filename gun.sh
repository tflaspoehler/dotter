pkill -f gunicorn
source .env/bin/activate
gunicorn app:app -b localhost:8000 --reload
