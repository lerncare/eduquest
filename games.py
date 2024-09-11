from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from models import GameProgress, User
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

@games.route('/emotionale_intelligenz')
@login_required
def emotionale_intelligenz():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='emotionale_intelligenz').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='emotionale_intelligenz')
        db.session.add(progress)
        db.session.commit()
    return render_template('emotionale_intelligenz.html', progress=progress)

@games.route('/submit_ei_answer', methods=['POST'])
@login_required
def submit_ei_answer():
    scenario_id = request.form.get('scenario_id')
    user_answer = request.form.get('answer')
    # Here you would typically check the answer and update the user's score
    # For now, we'll just return a success message
    return jsonify({'success': True, 'message': 'Antwort erfolgreich übermittelt!'})

# ... (rest of the existing code)
