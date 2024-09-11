from flask import Blueprint, render_template, jsonify, request, current_app
from flask_login import login_required, current_user
from models import GameProgress, User, Idea, Resource, MentoringRequest
from extensions import db
from sqlalchemy import desc
from datetime import datetime

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

@spiele.route('/netzwerk_nexus')
@login_required
def netzwerk_nexus():
    fortschritt = GameProgress.query.filter_by(user_id=current_user.id, game_name='netzwerk_nexus').first()
    if not fortschritt:
        fortschritt = GameProgress(user_id=current_user.id, game_name='netzwerk_nexus')
        db.session.add(fortschritt)
        db.session.commit()
    return render_template('netzwerk_nexus.html', progress=fortschritt)

@spiele.route('/ideen_inkubator')
@login_required
def ideen_inkubator():
    page = request.args.get('page', 1, type=int)
    per_page = 10  # Number of ideas per page
    ideas = Idea.query.order_by(desc(Idea.created_at)).paginate(page=page, per_page=per_page, error_out=False)
    return render_template('ideen_inkubator.html', ideas=ideas)

@spiele.route('/mentoring_maze')
@login_required
def mentoring_maze():
    users = User.query.filter(User.id != current_user.id).all()
    mentoring_requests = MentoringRequest.query.filter_by(mentee_id=current_user.id).all()
    return render_template('mentoring_maze.html', users=users, mentoring_requests=mentoring_requests)

@spiele.route('/ressourcen_roulette')
@login_required
def ressourcen_roulette():
    search_query = request.args.get('search', '')
    page = request.args.get('page', 1, type=int)
    per_page = 10  # Number of resources per page
    
    if search_query:
        resources = Resource.query.filter(Resource.title.ilike(f'%{search_query}%') | 
                                          Resource.description.ilike(f'%{search_query}%')).\
                                   order_by(desc(Resource.created_at)).\
                                   paginate(page=page, per_page=per_page, error_out=False)
    else:
        resources = Resource.query.order_by(desc(Resource.created_at)).\
                    paginate(page=page, per_page=per_page, error_out=False)
    
    return render_template('ressourcen_roulette.html', resources=resources, search_query=search_query)

@spiele.route('/api/submit_idea', methods=['POST'])
@login_required
def submit_idea():
    data = request.json
    new_idea = Idea(user_id=current_user.id, content=data['content'])
    db.session.add(new_idea)
    db.session.commit()
    return jsonify({"success": True, "message": "Idee erfolgreich eingereicht!"})

@spiele.route('/api/submit_resource', methods=['POST'])
@login_required
def submit_resource():
    data = request.json
    new_resource = Resource(user_id=current_user.id, title=data['title'], description=data['description'], link=data['link'])
    db.session.add(new_resource)
    db.session.commit()
    return jsonify({"success": True, "message": "Ressource erfolgreich eingereicht!"})

@spiele.route('/api/request_mentoring', methods=['POST'])
@login_required
def request_mentoring():
    data = request.json
    mentor_id = data['mentor_id']
    
    existing_request = MentoringRequest.query.filter_by(mentee_id=current_user.id, mentor_id=mentor_id, status='Ausstehend').first()
    if existing_request:
        return jsonify({"success": False, "message": "Eine Anfrage für diesen Mentor existiert bereits."})
    
    new_request = MentoringRequest(mentee_id=current_user.id, mentor_id=mentor_id)
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"success": True, "message": "Mentoring-Anfrage erfolgreich gesendet!"})

@spiele.route('/api/get_mentoring_requests', methods=['GET'])
@login_required
def get_mentoring_requests():
    requests = MentoringRequest.query.filter_by(mentee_id=current_user.id).all()
    request_data = [{
        "id": req.id,
        "mentor_name": User.query.get(req.mentor_id).username,
        "status": req.status,
        "created_at": req.created_at.strftime("%Y-%m-%d %H:%M:%S")
    } for req in requests]
    return jsonify(request_data)

@spiele.route('/api/update_mentoring_request', methods=['POST'])
@login_required
def update_mentoring_request():
    data = request.json
    request_id = data['request_id']
    new_status = data['status']
    
    mentoring_request = MentoringRequest.query.get(request_id)
    if not mentoring_request or mentoring_request.mentor_id != current_user.id:
        return jsonify({"success": False, "message": "Ungültige Anfrage oder keine Berechtigung."})
    
    mentoring_request.status = new_status
    mentoring_request.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({"success": True, "message": f"Mentoring-Anfrage wurde auf '{new_status}' aktualisiert."})
