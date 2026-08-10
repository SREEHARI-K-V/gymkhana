from datetime import date
from flask import Blueprint, jsonify, request
from app.middleware.auth_middleware import role_required
from app.models.workout import WorkoutPlan
from app.models.diet import DietPlan
from app.services.progress_service import ProgressService

member_bp = Blueprint('member', __name__, url_prefix='/api/member')

GYMKHANA_LOCATIONS = [
    {
        'id': 1,
        'name': 'Gymkhana Central HQ',
        'address': '742 Evergreen Terrace, Downtown City Center',
        'place': 'Downtown City Center, Metropolis',
        'city': 'Metropolis',
        'landmark': 'Opposite Financial District Metro Gate 3',
        'phone': '+1 (800) 555-0199',
        'email': 'centralhq@gymkhana.com',
        'manager': 'David Sterling',
        'operating_hours': '06:00 AM - 11:00 PM',
        'rating': 4.9,
        'reviews_count': 342,
        'capacity_status': 'Moderate (65% Full)',
        'description': 'Our flagship fitness facility equipped with state-of-the-art Olympic weightlifting equipment, luxury recovery zone, steam room, and executive lockers.',
        'image': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        'facilities': ['Olympic Barbell Racks', 'Cardio Floor', 'Sauna & Recovery Spa', 'Pool & Jacuzzi', 'Locker Rooms', 'Protein Smoothie Bar'],
        'trainers': [
            {'name': 'Marcus Vance', 'role': 'Head Strength Coach', 'exp': '8 Yrs'},
            {'name': 'Elena Rostova', 'role': 'Pilates & Mobility Specialist', 'exp': '6 Yrs'}
        ],
        'plans': [
            {'id': 'p1', 'title': 'Day Pass', 'price': 15, 'period': 'per day', 'benefits': ['Full Gym Floor Access', 'Locker Room & Sauna', '1 Complimentary Hydration Drink']},
            {'id': 'p2', 'title': 'Weekly Flex Pass', 'price': 45, 'period': 'per week', 'benefits': ['7 Days Unlimited Access', 'All Group Fitness Classes', '1 Trainer Consultation']},
            {'id': 'p3', 'title': 'Monthly Gold Access', 'price': 89, 'period': 'per month', 'benefits': ['24/7 Access to Central HQ', 'Free Sauna & Recovery Spa', 'Monthly Body Composition Scan']},
            {'id': 'p4', 'title': 'All-Network VIP', 'price': 149, 'period': 'per month', 'benefits': ['Access to All 4 Gymkhana Centers', 'Dedicated Personal Trainer', 'Private VIP Locker & Spa']}
        ],
        'available_slots': ['06:00 AM - 07:30 AM', '08:00 AM - 09:30 AM', '10:00 AM - 11:30 AM', '05:00 PM - 06:30 PM', '07:00 PM - 08:30 PM']
    },
    {
        'id': 2,
        'name': 'Gymkhana Westside Performance Hub',
        'address': '1280 Westside Blvd, Suite 400',
        'place': 'Westside Tech Park, Westside',
        'city': 'Westside',
        'landmark': 'Next to Silicon Hub Plaza',
        'phone': '+1 (800) 555-0288',
        'email': 'westside@gymkhana.com',
        'manager': 'Sarah Jenkins',
        'operating_hours': '05:00 AM - 10:00 PM',
        'rating': 4.8,
        'reviews_count': 280,
        'capacity_status': 'High Demand (82% Full)',
        'description': 'High-performance athletic conditioning center with dedicated powerlifting platforms, turf track, and advanced cryotherapy recovery chambers.',
        'image': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
        'facilities': ['Powerlifting Platforms', 'Turf & Sled Track', 'Cryotherapy', 'HIIT Zone', 'Protein Bar', 'Calisthenics Rig'],
        'trainers': [
            {'name': 'Jake Miller', 'role': 'Powerlifting & Conditioning', 'exp': '10 Yrs'},
            {'name': 'Chloe Bennett', 'role': 'Crossfit & HIIT Lead', 'exp': '5 Yrs'}
        ],
        'plans': [
            {'id': 'p1', 'title': 'Day Pass', 'price': 18, 'period': 'per day', 'benefits': ['Full Athletic Floor Access', 'Sled Track & Turf', 'Cryotherapy Trial']},
            {'id': 'p2', 'title': 'Athlete Monthly', 'price': 99, 'period': 'per month', 'benefits': ['Unlimited Turf & Powerlifting Floor', 'Bi-weekly Cryotherapy', 'Custom Workout Tracking']},
            {'id': 'p3', 'title': 'All-Network VIP', 'price': 149, 'period': 'per month', 'benefits': ['Access to All 4 Gymkhana Centers', 'Dedicated Personal Trainer', 'Unlimited Spa & Cryo']}
        ],
        'available_slots': ['05:30 AM - 07:00 AM', '07:30 AM - 09:00 AM', '12:00 PM - 01:30 PM', '04:30 PM - 06:00 PM', '06:30 PM - 08:00 PM']
    },
    {
        'id': 3,
        'name': 'Gymkhana Metro Elite Club',
        'address': '550 Financial District Ave, Floor 12',
        'place': 'Financial District, Metro Core',
        'city': 'Metro Core',
        'landmark': 'Floor 12, Apex Financial Tower',
        'phone': '+1 (800) 555-0377',
        'email': 'metroelite@gymkhana.com',
        'manager': 'Alexander Cross',
        'operating_hours': '06:00 AM - 10:00 PM',
        'rating': 4.9,
        'reviews_count': 415,
        'capacity_status': 'Light (40% Full)',
        'description': 'Exclusive boutique fitness club designed for executives, featuring panoramic skyline views, professional boxing ring, and private workout pods.',
        'image': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
        'facilities': ['VIP Lounge', 'Boxing Ring', 'Personal Training Pods', 'Juice Bar', 'Steam Room', 'Skyline Deck Workout'],
        'trainers': [
            {'name': 'Tyson Fury Jr.', 'role': 'Boxing & Combat Coach', 'exp': '9 Yrs'},
            {'name': 'Sophia Chen', 'role': 'Executive Wellness Coach', 'exp': '7 Yrs'}
        ],
        'plans': [
            {'id': 'p1', 'title': 'Executive Day Pass', 'price': 25, 'period': 'per day', 'benefits': ['Full Lounge & Sky Floor Access', 'Boxing Ring Access', 'Complimentary Organic Smoothie']},
            {'id': 'p2', 'title': 'Metro Platinum Monthly', 'price': 120, 'period': 'per month', 'benefits': ['Unlimited Sky Gym Access', 'Private Pod Reservations', 'Steam Room & Executive Amenities']},
            {'id': 'p3', 'title': 'All-Network VIP', 'price': 149, 'period': 'per month', 'benefits': ['Access to All 4 Gymkhana Centers', 'Dedicated Personal Trainer', 'Full Executive Privileges']}
        ],
        'available_slots': ['06:30 AM - 08:00 AM', '08:30 AM - 10:00 AM', '01:00 PM - 02:30 PM', '05:30 PM - 07:00 PM', '07:30 PM - 09:00 PM']
    },
    {
        'id': 4,
        'name': 'Gymkhana Heights Fitness Center',
        'address': '910 Skyline Drive, Heights Tower',
        'place': 'Skyline Ridge, North Heights',
        'city': 'North Heights',
        'landmark': 'Adjacent to Heights Shopping Galleria',
        'phone': '+1 (800) 555-0466',
        'email': 'heights@gymkhana.com',
        'manager': 'Rachel Adams',
        'operating_hours': '05:30 AM - 11:00 PM',
        'rating': 4.7,
        'reviews_count': 198,
        'capacity_status': 'Moderate (55% Full)',
        'description': 'Family-friendly and holistic wellness center featuring pilates reformers, crossfit rigs, indoor cycling, and relaxing thermal spa baths.',
        'image': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        'facilities': ['Crossfit Rig', 'Indoor Cycling Studio', 'Pilates Reformers', 'Nutritional Counseling', 'Spa Baths', 'Kids Care Zone'],
        'trainers': [
            {'name': 'Daniel Kim', 'role': 'Crossfit & Cycling Lead', 'exp': '6 Yrs'},
            {'name': 'Amara Okafor', 'role': 'Nutrition & Wellness Consultant', 'exp': '8 Yrs'}
        ],
        'plans': [
            {'id': 'p1', 'title': 'Day Pass', 'price': 15, 'period': 'per day', 'benefits': ['Full Gym & Cycling Studio Access', 'Locker & Spa Baths']},
            {'id': 'p2', 'title': 'Heights Reformer & Gym Pass', 'price': 79, 'period': 'per month', 'benefits': ['Full Gym Floor Access', '2 Pilates Reformer Classes/wk', 'Nutritional Assessment']},
            {'id': 'p3', 'title': 'All-Network VIP', 'price': 149, 'period': 'per month', 'benefits': ['Access to All 4 Gymkhana Centers', 'Dedicated Personal Trainer', 'All Specialty Classes Included']}
        ],
        'available_slots': ['06:00 AM - 07:30 AM', '09:00 AM - 10:30 AM', '03:00 PM - 04:30 PM', '06:00 PM - 07:30 PM', '08:00 PM - 09:30 PM']
    }
]

MEMBER_BOOKINGS = []

@member_bp.route('/dashboard', methods=['GET'])
@role_required(['MEMBER'])
def member_dashboard(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    curr_sub = member.current_subscription
    workout = member.workout_plans.order_by(WorkoutPlan.created_at.desc()).first()
    diet = member.diet_plans.order_by(DietPlan.created_at.desc()).first()
    analytics = ProgressService.get_member_analytics(member.id)

    today_day_str = date.today().strftime('%A').upper()

    todays_exercises = []
    if workout:
        todays_exercises = [ex.to_dict() for ex in workout.exercises.filter_by(day_of_week=today_day_str).all()]

    todays_meals = []
    if diet:
        todays_meals = [m.to_dict() for m in diet.meals.filter_by(day_of_week=today_day_str).all()]

    user_bookings = [b for b in MEMBER_BOOKINGS if b.get('user_id') == current_user.id]

    return jsonify({
        'success': True,
        'member': member.to_dict(),
        'subscription': curr_sub.to_dict() if curr_sub else None,
        'today_day': today_day_str,
        'todays_exercises': todays_exercises,
        'todays_meals': todays_meals,
        'workout_plan': workout.to_dict() if workout else None,
        'diet_plan': diet.to_dict() if diet else None,
        'progress_summary': analytics,
        'gyms': GYMKHANA_LOCATIONS,
        'active_bookings': user_bookings
    }), 200

@member_bp.route('/subscription', methods=['GET'])
@role_required(['MEMBER'])
def get_member_subscription(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    curr_sub = member.current_subscription
    history = [s.to_dict() for s in member.subscriptions.order_by(member.subscriptions.model.created_at.desc()).all()]

    return jsonify({
        'success': True,
        'current_subscription': curr_sub.to_dict() if curr_sub else None,
        'history': history
    }), 200

@member_bp.route('/gyms', methods=['GET'])
@role_required(['MEMBER'])
def get_gym_locations(current_user):
    user_bookings = [b for b in MEMBER_BOOKINGS if b.get('user_id') == current_user.id]
    return jsonify({
        'success': True,
        'gyms': GYMKHANA_LOCATIONS,
        'bookings': user_bookings
    }), 200

@member_bp.route('/bookings', methods=['POST'])
@role_required(['MEMBER'])
def create_gym_booking(current_user):
    data = request.json or {}
    gym_id = data.get('gym_id')
    slot_time = data.get('slot_time')
    booking_date = data.get('booking_date', date.today().isoformat())
    workout_type = data.get('workout_type', 'General Gym Access')
    plan_title = data.get('plan_title', 'Day Pass')
    plan_price = data.get('plan_price', 15)

    gym = next((g for g in GYMKHANA_LOCATIONS if g['id'] == int(gym_id or 1)), GYMKHANA_LOCATIONS[0])

    booking = {
        'id': len(MEMBER_BOOKINGS) + 101,
        'user_id': current_user.id,
        'gym_id': gym['id'],
        'gym_name': gym['name'],
        'gym_address': gym['address'],
        'gym_place': gym.get('place', gym['city']),
        'booking_date': booking_date,
        'slot_time': slot_time,
        'workout_type': workout_type,
        'plan_title': plan_title,
        'plan_price': plan_price,
        'status': 'CONFIRMED',
        'pass_code': f'GYM-PASS-{gym["id"]}{len(MEMBER_BOOKINGS)+101}'
    }
    MEMBER_BOOKINGS.append(booking)

    return jsonify({
        'success': True,
        'message': f'Slot booked successfully at {gym["name"]}!',
        'booking': booking
    }), 201
