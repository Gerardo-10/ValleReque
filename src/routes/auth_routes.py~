# src/routes/auth_routes.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app
from flask_login import login_user, logout_user, login_required
from src.models.ModelUser import ModelUser

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/')
def index():
    return redirect(url_for('auth_routes.login'))

@auth_routes.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        logged_user = ModelUser.login(current_app.db, username, password)
        if logged_user:
            session['user_id'] = logged_user.id_usuario
            session['username'] = logged_user.username
            login_user(logged_user)
            return redirect(url_for('home_routes.home'))
        else:
            flash("Credenciales Incorrectas", "danger")
            return redirect(url_for('auth_routes.login'))
    return render_template('auth/login.html')

@auth_routes.route('/logout')
def logout():
    logout_user()
    session.clear()
    return redirect(url_for('auth_routes.login'))
