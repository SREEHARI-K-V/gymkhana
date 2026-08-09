from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'success': False, 'message': 'Bad Request', 'error': str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'success': False, 'message': 'Unauthorized', 'error': str(e)}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({'success': False, 'message': 'Access Forbidden', 'error': str(e)}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'message': 'Resource Not Found', 'error': str(e)}), 404

    @app.errorhandler(422)
    def unprocessable_entity(e):
        return jsonify({'success': False, 'message': 'Unprocessable Entity / Validation Error', 'error': str(e)}), 422

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'success': False, 'message': 'Internal Server Error', 'error': str(e)}), 500

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        response = e.get_response()
        return jsonify({'success': False, 'message': e.description, 'code': e.code}), e.code
