from flask import Blueprint, render_template
from flask_login import login_required, current_user
from models import GameProgress
from extensions import db

spiele = Blueprint('games', __name__)

@spiele.route('/profil')
@login_required
def profil():
    return render_template('profile.html', name=current_user.username)

@spiele.route('/mindmaster')
@login_required
def mindmaster():
    fortschritt = GameProgress.query.filter_by(user_id=current_user.id, game_name='mindmaster').first()
    if not fortschritt:
        fortschritt = GameProgress(user_id=current_user.id, game_name='mindmaster')
        db.session.add(fortschritt)
        db.session.commit()
    return render_template('mindmaster.html', progress=fortschritt)

@spiele.route('/ressourcenrallye')
@login_required
def ressourcenrallye():
    fortschritt = GameProgress.query.filter_by(user_id=current_user.id, game_name='resourcerally').first()
    if not fortschritt:
        fortschritt = GameProgress(user_id=current_user.id, game_name='resourcerally')
        db.session.add(fortschritt)
        db.session.commit()
    return render_template('resourcerally.html', progress=fortschritt)

@spiele.route('/zen_zone')
@login_required
def zen_zone():
    fortschritt = GameProgress.query.filter_by(user_id=current_user.id, game_name='zen_zone').first()
    if not fortschritt:
        fortschritt = GameProgress(user_id=current_user.id, game_name='zen_zone')
        db.session.add(fortschritt)
        db.session.commit()
    return render_template('zen_zone.html', progress=fortschritt)
