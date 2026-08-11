from datetime import date
import random
from flask import Blueprint, jsonify, request
from app.middleware.auth_middleware import role_required
from app.models.workout import WorkoutPlan
from app.models.diet import DietPlan
from app.services.progress_service import ProgressService

member_bp = Blueprint('member', __name__, url_prefix='/api/member')

# In-memory database of official Gymkhana Centers & Active Member Bookings
GYMKHANA_CENTERS = [
    {
        "id": 1,
        "name": "Gymkhana Elite Fitness - Downtown",
        "city": "New York",
        "place": "Manhattan Downtown",
        "address": "124 5th Avenue, Suite 400",
        "landmark": "Near Flatiron Building",
        "phone": "+1 (555) 234-5678",
        "operating_hours": "05:00 AM - 11:00 PM",
        "rating": 4.9,
        "reviews_count": 240,
        "capacity_status": "Open Today • 45% Capacity",
        "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
        "description": "Flagship Gymkhana training center featuring modern strength equipment, cardio theater, sauna, steam room, and certified personal trainers.",
        "facilities": ["Olympic Lifting Platforms", "Sauna & Steam Room", "Cardio Theater", "Crossfit Turf Zone", "Locker & Luxury Showers", "Free WiFi"],
        "plans": [
            { "id": 101, "title": "Single Day Pass", "price": 15, "period": "per day", "description": "Full 1-day access to gym facilities & open slot reservations" },
            { "id": 102, "title": "Monthly Access Plan", "price": 49, "period": "per month", "description": "Unlimited gym access & priority slot booking for 30 days" },
            { "id": 103, "title": "VIP Annual Pass", "price": 499, "period": "per year", "description": "All-center access across all locations + 2 free trainer sessions" }
        ],
        "available_slots": [
            "06:00 AM - 07:30 AM",
            "07:30 AM - 09:00 AM",
            "09:00 AM - 10:30 AM",
            "04:00 PM - 05:30 PM",
            "05:30 PM - 07:00 PM",
            "07:00 PM - 08:30 PM"
        ]
    },
    {
        "id": 2,
        "name": "Gymkhana Powerhouse - Williamsburg",
        "city": "Brooklyn",
        "place": "Williamsburg",
        "address": "78 Bedford Avenue",
        "landmark": "Near McCarren Park",
        "phone": "+1 (555) 876-5432",
        "operating_hours": "06:00 AM - 10:00 PM",
        "rating": 4.8,
        "reviews_count": 185,
        "capacity_status": "Open Today • 30% Capacity",
        "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
        "description": "High-intensity strength & conditioning center with dedicated powerlifting racks, heavy boxing bags, and outdoor turf space.",
        "facilities": ["Power Racks", "Heavy Boxing Ring", "Outdoor Functional Turf", "Juice & Protein Bar", "Personal Coaching"],
        "plans": [
            { "id": 201, "title": "Day Pass", "price": 12, "period": "per day", "description": "1-day access to strength & turf area" },
            { "id": 202, "title": "Monthly Brooklyn Pass", "price": 39, "period": "per month", "description": "Unlimited Brooklyn location entry" },
            { "id": 203, "title": "Athlete Pro Membership", "price": 399, "period": "per year", "description": "Full access to heavy gear, ring & all training classes" }
        ],
        "available_slots": [
            "06:30 AM - 08:00 AM",
            "08:00 AM - 09:30 AM",
            "05:00 PM - 06:30 PM",
            "06:30 PM - 08:00 PM"
        ]
    },
    {
        "id": 3,
        "name": "Gymkhana Wellness Hub - Queens Plaza",
        "city": "Queens",
        "place": "Long Island City",
        "address": "28-10 Jackson Avenue",
        "landmark": "Opposite Queens Plaza Station",
        "phone": "+1 (555) 345-6789",
        "operating_hours": "05:30 AM - 10:30 PM",
        "rating": 4.7,
        "reviews_count": 130,
        "capacity_status": "Open Today • 55% Capacity",
        "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
        "description": "Holistic fitness center offering strength zones, spin studio, yoga sanctuary, and hydro-massage beds.",
        "facilities": ["Yoga Studio", "Spinning Room", "Hydro Massage", "Strength Machines", "Showers", "Café"],
        "plans": [
            { "id": 301, "title": "Day Pass", "price": 14, "period": "per day", "description": "Day entry including yoga & spin classes" },
            { "id": 302, "title": "Monthly All-Access Pass", "price": 45, "period": "per month", "description": "Unlimited entry & class bookings" },
            { "id": 303, "title": "Wellness Platinum Plan", "price": 449, "period": "per year", "description": "All classes, massage beds & multi-center access" }
        ],
        "available_slots": [
            "07:00 AM - 08:30 AM",
            "08:30 AM - 10:00 AM",
            "05:30 PM - 07:00 PM",
            "07:00 PM - 08:30 PM"
        ]
    },
    {
        "id": 4,
        "name": "Gymkhana Performance Arena - Los Angeles",
        "city": "Los Angeles",
        "place": "Santa Monica",
        "address": "1420 Ocean Avenue",
        "landmark": "Near Santa Monica Pier",
        "phone": "+1 (310) 555-0199",
        "operating_hours": "05:00 AM - 11:00 PM",
        "rating": 4.95,
        "reviews_count": 310,
        "capacity_status": "Open Today • 60% Capacity",
        "image": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
        "description": "Premier oceanfront training arena with rooftop outdoor workout turf, swimming pool, recovery plunge pools, and elite conditioning suites.",
        "facilities": ["Rooftop Workout Turf", "Swimming Pool", "Cold Plunge & Hot Sauna", "Olympic Lifting", "Juice Bar", "Valet Parking"],
        "plans": [
            { "id": 401, "title": "Day Pass", "price": 20, "period": "per day", "description": "Full oceanfront arena & pool access for 1 day" },
            { "id": 402, "title": "Monthly LA Pass", "price": 65, "period": "per month", "description": "Unlimited LA center & pool entry" },
            { "id": 403, "title": "Gold VIP Membership", "price": 599, "period": "per year", "description": "Global all-center access, valet & plunge access" }
        ],
        "available_slots": [
            "06:00 AM - 07:30 AM",
            "07:30 AM - 09:00 AM",
            "09:00 AM - 10:30 AM",
            "04:30 PM - 06:00 PM",
            "06:00 PM - 07:30 PM"
        ]
    }
]

MEMBER_BOOKINGS = [
    {
        "id": 1,
        "gym_id": 1,
        "gym_name": "Gymkhana Elite Fitness - Downtown",
        "gym_place": "Manhattan Downtown",
        "gym_address": "124 5th Avenue, Suite 400",
        "booking_date": str(date.today()),
        "slot_time": "06:00 AM - 07:30 AM",
        "workout_type": "Full Gym Access & Weightlifting",
        "plan_title": "Single Day Pass",
        "plan_price": 15,
        "pass_code": "GK-NYC-9482",
        "status": "CONFIRMED"
    }
]

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
        'gyms': GYMKHANA_CENTERS,
        'active_bookings': MEMBER_BOOKINGS
    }), 200

@member_bp.route('/gyms', methods=['GET'])
@role_required(['MEMBER'])
def get_gyms_and_bookings(current_user):
    return jsonify({
        'success': True,
        'gyms': GYMKHANA_CENTERS,
        'bookings': MEMBER_BOOKINGS
    }), 200

@member_bp.route('/book-slot', methods=['POST'])
@role_required(['MEMBER'])
def book_gym_slot(current_user):
    data = request.json or {}
    gym_id = data.get('gym_id')
    slot_time = data.get('slot_time')
    booking_date = data.get('booking_date', str(date.today()))
    workout_type = data.get('workout_type', 'General Fitness')
    plan_title = data.get('plan_title', 'Day Pass')
    plan_price = data.get('plan_price', 15)

    target_gym = next((g for g in GYMKHANA_CENTERS if g['id'] == gym_id), GYMKHANA_CENTERS[0])
    pass_code = f"GK-{target_gym['city'][:3].upper()}-{random.randint(1000, 9999)}"

    new_booking = {
        "id": len(MEMBER_BOOKINGS) + 1,
        "gym_id": target_gym['id'],
        "gym_name": target_gym['name'],
        "gym_place": target_gym['place'],
        "gym_address": target_gym['address'],
        "booking_date": booking_date,
        "slot_time": slot_time or "08:00 AM - 09:30 AM",
        "workout_type": workout_type,
        "plan_title": plan_title,
        "plan_price": plan_price,
        "pass_code": pass_code,
        "status": "CONFIRMED"
    }
    MEMBER_BOOKINGS.insert(0, new_booking)

    return jsonify({
        'success': True,
        'message': f'Slot booked successfully for {target_gym["name"]}!',
        'booking': new_booking
    }), 201

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
