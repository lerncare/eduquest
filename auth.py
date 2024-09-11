from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user
from models import User
from extensions import db

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    benutzername = request.form.get('username')
    passwort = request.form.get('password')
    angemeldet_bleiben = True if request.form.get('remember') else False

    benutzer = User.query.filter_by(username=benutzername).first()

    if not benutzer or not check_password_hash(benutzer.password_hash, passwort):
        flash('Bitte überprüfe deine Anmeldedaten und versuche es erneut.')
        return redirect(url_for('auth.login'))

    login_user(benutzer, remember=angemeldet_bleiben)
    return redirect(url_for('spiele.profil'))

@auth.route('/register')
def register():
    return render_template('register.html')

@auth.route('/register', methods=['POST'])
def register_post():
    benutzername = request.form.get('username')
    email = request.form.get('email')
    passwort = request.form.get('password')

    benutzer = User.query.filter_by(email=email).first()

    if benutzer:
        flash('Diese E-Mail-Adresse ist bereits registriert.')
        return redirect(url_for('auth.register'))

    neuer_benutzer = User(username=benutzername, email=email)
    neuer_benutzer.set_password(passwort)

    db.session.add(neuer_benutzer)
    db.session.commit()

    flash('Dein Konto wurde erfolgreich erstellt. Du kannst dich jetzt anmelden.')
    return redirect(url_for('auth.login'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Du wurdest erfolgreich abgemeldet.')
    return redirect(url_for('index'))
