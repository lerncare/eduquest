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

@games.route('/zeitmanagement_tetris')
@login_required
def zeitmanagement_tetris():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='zeitmanagement_tetris').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='zeitmanagement_tetris')
        db.session.add(progress)
        db.session.commit()
    return render_template('zeitmanagement_tetris.html', progress=progress)

@games.route('/submit_tetris_score', methods=['POST'])
@login_required
def submit_tetris_score():
    score = request.form.get('score')
    # Update the user's score in the database
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='zeitmanagement_tetris').first()
    if progress:
        progress.score = max(progress.score, int(score))
        db.session.commit()
    return jsonify({'success': True, 'message': 'Score erfolgreich aktualisiert!'})

@games.route('/resourcerally')
@login_required
def resourcerally():
    # This route is for the Ressourcen-Rallye game
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='resourcerally').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='resourcerally')
        db.session.add(progress)
        db.session.commit()
    return render_template('resourcerally.html', progress=progress)

@games.route('/zen_zone')
@login_required
def zen_zone():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='zen_zone').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='zen_zone')
        db.session.add(progress)
        db.session.commit()
    return render_template('zen_zone.html', progress=progress)

@games.route('/netzwerk_nexus')
@login_required
def netzwerk_nexus():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='netzwerk_nexus').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='netzwerk_nexus')
        db.session.add(progress)
        db.session.commit()
    return render_template('netzwerk_nexus.html', progress=progress)

@games.route('/eltern_escape_room')
@login_required
def eltern_escape_room():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='eltern_escape_room').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='eltern_escape_room')
        db.session.add(progress)
        db.session.commit()
    return render_template('eltern_escape_room.html', progress=progress)

@games.route('/verhaltens_vortex')
@login_required
def verhaltens_vortex():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='verhaltens_vortex').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='verhaltens_vortex')
        db.session.add(progress)
        db.session.commit()
    return render_template('verhaltens_vortex.html', progress=progress)

@games.route('/admin_archipel')
@login_required
def admin_archipel():
    progress = GameProgress.query.filter_by(user_id=current_user.id, game_name='admin_archipel').first()
    if not progress:
        progress = GameProgress(user_id=current_user.id, game_name='admin_archipel')
        db.session.add(progress)
        db.session.commit()
    return render_template('admin_archipel.html', progress=progress)

# ... (rest of the existing code)
