from flask import Blueprint, render_template
from flask_login import login_required, current_user
from models import GameProgress
from extensions import db

games = Blueprint('games', __name__)

@games.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.username)

@games.route('/mindmaster')
@login_required
def mindmaster():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='mindmaster').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='mindmaster')
        db.session.add(progress)
        db.session.commit()
    return render_template('mindmaster.html', progress=progress)

@games.route('/resourcerally')
@login_required
def resourcerally():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='resourcerally').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='resourcerally')
        db.session.add(progress)
        db.session.commit()
    return render_template('resourcerally.html', progress=progress)
