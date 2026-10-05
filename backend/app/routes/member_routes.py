from datetime import date, datetime, timedelta
import random
from flask import Blueprint, jsonify, request
from app.extensions import db
from app.middleware.auth_middleware import role_required
from app.models.workout import WorkoutPlan
from app.models.diet import DietPlan
from app.models.subscription import SubscriptionPlan, MemberSubscription
from app.services.progress_service import ProgressService

member_bp = Blueprint('member', __name__, url_prefix='/api/member')

# Official Gymkhana Branches Network
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
    },
    {
        "id": 5,
        "name": "Gymkhana Coastal Club - Miami",
        "city": "Miami",
        "place": "South Beach",
        "address": "900 Ocean Drive",
        "landmark": "Art Deco District",
        "phone": "+1 (305) 555-4321",
        "operating_hours": "05:00 AM - 11:30 PM",
        "rating": 4.9,
        "reviews_count": 178,
        "capacity_status": "Open Today • 50% Capacity",
        "image": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
        "description": "Luxurious beachfront training sanctuary with beach calisthenics area, high-end cardio deck, recovery spa, and athletic smoothies.",
        "facilities": ["Beach Calisthenics Area", "Cold Cryo Therapy", "Infrared Saunas", "Luxury Locker Suites", "Free Valet"],
        "plans": [
            { "id": 501, "title": "Beach Day Pass", "price": 18, "period": "per day", "description": "Full day coastal gym and spa access" },
            { "id": 502, "title": "Miami Club Monthly", "price": 55, "period": "per month", "description": "Unlimited South Beach access" },
            { "id": 503, "title": "Diamond Coast VIP", "price": 550, "period": "per year", "description": "All clubs + Cryo sessions included" }
        ],
        "available_slots": [
            "06:00 AM - 07:30 AM",
            "08:00 AM - 09:30 AM",
            "05:00 PM - 06:30 PM",
            "07:00 PM - 08:30 PM"
        ]
    }
]

# In-memory Member Bookings
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

# In-memory Member Notifications
MEMBER_NOTIFICATIONS = [
    {
        "id": 1,
        "title": "Workout Routine Updated",
        "message": "Coach Alex Vance updated your Hypertrophy Split with higher leg press volume.",
        "type": "WORKOUT",
        "category": "TRAINING",
        "is_read": False,
        "created_at": "15 minutes ago",
        "action_link": "/member/workout",
        "action_label": "View Routine"
    },
    {
        "id": 2,
        "title": "Membership Renewal Reminder",
        "message": "Your Pro Performance subscription has 5 days remaining. Renew early to retain VIP privileges!",
        "type": "RENEWAL",
        "category": "BILLING",
        "is_read": False,
        "created_at": "2 hours ago",
        "action_link": "/member/membership",
        "action_label": "Renew Plan"
    },
    {
        "id": 3,
        "title": "Gym Slot Pass Confirmed",
        "message": "Your entry pass GK-NYC-9482 for Downtown Manhattan is active for 06:00 AM - 07:30 AM.",
        "type": "SLOT",
        "category": "GYM",
        "is_read": False,
        "created_at": "Today at 07:00 AM",
        "action_link": "/member/branches",
        "action_label": "View Pass"
    },
    {
        "id": 4,
        "title": "Nutrition Target Reached Yesterday",
        "message": "Great job! You met your protein target of 190g yesterday.",
        "type": "DIET",
        "category": "NUTRITION",
        "is_read": True,
        "created_at": "Yesterday",
        "action_link": "/member/diet",
        "action_label": "View Diet"
    },
    {
        "id": 5,
        "title": "New Branch Opening: South Beach Miami",
        "message": "Gymkhana Coastal Club Miami is now open for all Elite & VIP tier members!",
        "type": "ANNOUNCEMENT",
        "category": "SYSTEM",
        "is_read": True,
        "created_at": "3 days ago",
        "action_link": "/member/branches",
        "action_label": "Explore Branch"
    }
]

# In-memory Member Feedback & Reviews
MEMBER_REVIEWS = [
    {
        "id": 1,
        "user_name": "David Thomas",
        "user_avatar": "D",
        "branch_name": "Gymkhana Elite Fitness - Downtown",
        "trainer_name": "Alex Vance",
        "category": "Gym Facilities",
        "rating": 5,
        "date": "2026-09-28",
        "title": "Exceptional equipment and motivating atmosphere!",
        "comment": "The Olympic lifting platforms and sauna here are best-in-class. Cleanliness is top tier and Alex Vance gives phenomenal training advice.",
        "helpful_count": 18,
        "response": "Thank you David! Our team strives every day to keep the Downtown floor in competition condition."
    },
    {
        "id": 2,
        "user_name": "Mia Jackson",
        "user_avatar": "M",
        "branch_name": "Gymkhana Powerhouse - Williamsburg",
        "trainer_name": "Sara Connor",
        "category": "Personal Coaching",
        "rating": 5,
        "date": "2026-09-20",
        "title": "Lost 4kg in my first month!",
        "comment": "Sara Connor customized my HIIT workouts and diet plan perfectly. Love the boxing ring and turf zone at the Williamsburg branch.",
        "helpful_count": 24,
        "response": "So proud of your progress Mia! Keep smashing those HIIT PRs!"
    },
    {
        "id": 3,
        "user_name": "Robert White",
        "user_avatar": "R",
        "branch_name": "Gymkhana Performance Arena - Los Angeles",
        "trainer_name": "Marcus Steel",
        "category": "Equipment & Space",
        "rating": 4,
        "date": "2026-09-15",
        "title": "Rooftop turf is world-class, slightly busy at 6 PM",
        "comment": "The Santa Monica ocean view while lifting is unbeatable. Recovery cold plunges are legendary. Gets slightly packed around 6 PM peak hours.",
        "helpful_count": 12,
        "response": "Appreciate the feedback Robert! We are expanding 6 PM slot caps and opening additional turf racks next week."
    }
]

# Additional Member Preferences Cache
MEMBER_PREFERENCES = {}

# ----------------- ROUTES ----------------- #

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

    unread_notifications = [n for n in MEMBER_NOTIFICATIONS if not n['is_read']]

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
        'active_bookings': MEMBER_BOOKINGS,
        'notifications_count': len(unread_notifications),
        'recent_notifications': MEMBER_NOTIFICATIONS[:3]
    }), 200


@member_bp.route('/profile', methods=['GET', 'PUT'])
@role_required(['MEMBER'])
def member_profile(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    pref = MEMBER_PREFERENCES.get(member.id, {
        'fitness_goal': 'Muscle Building & Hypertrophy',
        'target_weight': 72.0,
        'experience_level': 'Intermediate',
        'blood_group': 'O+',
        'dietary_preference': 'High Protein / Omnivore'
    })

    if request.method == 'PUT':
        data = request.json or {}
        if 'full_name' in data:
            current_user.full_name = data['full_name']
        if 'phone' in data:
            current_user.phone = data['phone']
        if 'gender' in data:
            member.gender = data['gender']
        if 'emergency_contact' in data:
            member.emergency_contact = data['emergency_contact']
        if 'height_cm' in data:
            try:
                member.height_cm = float(data['height_cm'])
            except (ValueError, TypeError):
                pass
        if 'date_of_birth' in data and data['date_of_birth']:
            try:
                member.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except Exception:
                pass

        # Update preferences
        pref['fitness_goal'] = data.get('fitness_goal', pref['fitness_goal'])
        pref['target_weight'] = float(data.get('target_weight', pref['target_weight']))
        pref['experience_level'] = data.get('experience_level', pref['experience_level'])
        pref['blood_group'] = data.get('blood_group', pref['blood_group'])
        pref['dietary_preference'] = data.get('dietary_preference', pref['dietary_preference'])
        MEMBER_PREFERENCES[member.id] = pref

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully!',
            'member': {
                **member.to_dict(),
                'member_code': f"GK-MEM-{member.id:04d}",
                'target_weight': pref['target_weight'],
                'fitness_goal': pref['fitness_goal'],
                'experience_level': pref['experience_level'],
                'blood_group': pref['blood_group'],
                'dietary_preference': pref['dietary_preference']
            }
        }), 200

    analytics = ProgressService.get_member_analytics(member.id)
    latest_weight = analytics.get('latest', {}).get('weight', 75.0)

    return jsonify({
        'success': True,
        'profile': {
            **member.to_dict(),
            'member_code': f"GK-MEM-{member.id:04d}",
            'current_weight': latest_weight,
            'target_weight': pref['target_weight'],
            'fitness_goal': pref['fitness_goal'],
            'experience_level': pref['experience_level'],
            'blood_group': pref['blood_group'],
            'dietary_preference': pref['dietary_preference'],
            'join_date': member.user.created_at.strftime('%B %d, %Y') if member.user and member.user.created_at else 'January 2026'
        }
    }), 200


@member_bp.route('/membership', methods=['GET'])
@role_required(['MEMBER'])
def member_membership(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    curr_sub = member.current_subscription
    available_plans = [p.to_dict() for p in SubscriptionPlan.query.filter_by(is_active=True).all()]

    # If no plans in DB, provide standard Gymkhana plans
    if not available_plans:
        available_plans = [
            { 'id': 1, 'title': 'Basic Fitness Plan', 'duration_months': 1, 'price': 49.99, 'features': ['Access to Gym Equipment', 'Locker Room Access', '1 Free Assessment'] },
            { 'id': 2, 'title': 'Pro Performance Plan', 'duration_months': 3, 'price': 129.99, 'features': ['All Basic Features', 'Personal Trainer Assignment', 'Customized Workout Plan', 'Sauna Access'] },
            { 'id': 3, 'title': 'Elite Athlete Plan', 'duration_months': 6, 'price': 229.99, 'features': ['All Pro Features', 'Dedicated Nutrition Plan', 'Weekly Body Comp Analysis', 'Priority Support'] },
            { 'id': 4, 'title': 'VIP Platinum Lifetime', 'duration_months': 12, 'price': 399.99, 'features': ['All Elite Features', 'Unlimited Guest Passes', 'Free Supplements Pack', 'VIP Lounge Access'] }
        ]

    return jsonify({
        'success': True,
        'current_subscription': curr_sub.to_dict() if curr_sub else None,
        'available_plans': available_plans
    }), 200


@member_bp.route('/renew', methods=['POST'])
@role_required(['MEMBER'])
def renew_membership(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    data = request.json or {}
    plan_id = data.get('plan_id', 2)
    payment_method = data.get('payment_method', 'Credit Card (•••• 4242)')

    plan = SubscriptionPlan.query.get(plan_id)
    if not plan:
        plan_title = data.get('plan_title', 'Pro Performance Plan')
        price = float(data.get('price', 129.99))
        duration = int(data.get('duration_months', 3))
    else:
        plan_title = plan.title
        price = float(plan.price)
        duration = plan.duration_months

    today = date.today()
    curr_sub = member.current_subscription
    
    # Calculate new dates
    if curr_sub and curr_sub.end_date > today:
        new_start = curr_sub.end_date
    else:
        new_start = today
    new_end = new_start + timedelta(days=30 * duration)

    # If plan is in db, record it
    if plan:
        new_sub = MemberSubscription(
            member_id=member.id,
            plan_id=plan.id,
            start_date=new_start,
            end_date=new_end,
            status='ACTIVE',
            payment_status='PAID',
            payment_amount=price
        )
        db.session.add(new_sub)
        db.session.commit()
        ret_sub = new_sub.to_dict()
    else:
        ret_sub = {
            'id': 999,
            'plan_title': plan_title,
            'start_date': str(new_start),
            'end_date': str(new_end),
            'status': 'ACTIVE',
            'days_remaining': (new_end - today).days,
            'payment_status': 'PAID',
            'payment_amount': price
        }

    # Add notification for the member
    MEMBER_NOTIFICATIONS.insert(0, {
        "id": len(MEMBER_NOTIFICATIONS) + 1,
        "title": "Membership Renewed Successfully!",
        "message": f"Your {plan_title} is active until {new_end}. Paid ${price:.2f} via {payment_method}.",
        "type": "RENEWAL",
        "category": "BILLING",
        "is_read": False,
        "created_at": "Just now",
        "action_link": "/member/membership",
        "action_label": "View Plan"
    })

    return jsonify({
        'success': True,
        'message': f'Membership successfully renewed for {plan_title}!',
        'subscription': ret_sub
    }), 200


@member_bp.route('/payments', methods=['GET'])
@role_required(['MEMBER'])
def member_payments(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    history = [s.to_dict() for s in member.subscriptions.order_by(member.subscriptions.model.created_at.desc()).all()]

    invoices = []
    total_spent = 0.0

    for idx, sub in enumerate(history):
        amount = float(sub.get('payment_amount', 49.99))
        total_spent += amount
        invoices.append({
            'id': f"INV-2026-{(1042 + idx)}",
            'sub_id': sub['id'],
            'plan_title': sub['plan_title'],
            'date': sub['start_date'],
            'amount': amount,
            'payment_method': 'Visa ending in •••• 4242' if idx % 2 == 0 else 'Apple Pay',
            'status': 'PAID',
            'tax_amount': round(amount * 0.08, 2),
            'billing_address': 'Gymkhana HQ, 124 5th Ave, NY 10011',
            'receipt_url': '#'
        })

    # If no history exists yet, generate sample active invoice
    if not invoices:
        invoices = [
            {
                'id': 'INV-2026-1042',
                'sub_id': 1,
                'plan_title': 'Pro Performance Plan (3 Months)',
                'date': str(date.today() - timedelta(days=25)),
                'amount': 129.99,
                'payment_method': 'Visa ending in •••• 4242',
                'status': 'PAID',
                'tax_amount': 10.40,
                'billing_address': 'Gymkhana HQ, 124 5th Ave, NY 10011',
                'receipt_url': '#'
            }
        ]
        total_spent = 129.99

    return jsonify({
        'success': True,
        'total_spent': round(total_spent, 2),
        'invoices': invoices,
        'active_plan': member.current_subscription.to_dict() if member.current_subscription else None
    }), 200


@member_bp.route('/gyms', methods=['GET'])
@member_bp.route('/branches', methods=['GET'])
@role_required(['MEMBER'])
def get_gyms_and_bookings(current_user):
    return jsonify({
        'success': True,
        'branches': GYMKHANA_CENTERS,
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

    # Add confirmation notification
    MEMBER_NOTIFICATIONS.insert(0, {
        "id": len(MEMBER_NOTIFICATIONS) + 1,
        "title": "Gym Slot Confirmed!",
        "message": f"Pass {pass_code} active for {target_gym['name']} on {booking_date} at {slot_time}.",
        "type": "SLOT",
        "category": "GYM",
        "is_read": False,
        "created_at": "Just now",
        "action_link": "/member/branches",
        "action_label": "View Pass"
    })

    return jsonify({
        'success': True,
        'message': f'Slot booked successfully for {target_gym["name"]}!',
        'booking': new_booking
    }), 201


@member_bp.route('/reviews', methods=['GET', 'POST'])
@role_required(['MEMBER'])
def member_reviews(current_user):
    if request.method == 'POST':
        data = request.json or {}
        rating = int(data.get('rating', 5))
        comment = data.get('comment', '').strip()
        title = data.get('title', 'Great gym experience!').strip()
        branch_name = data.get('branch_name', 'Gymkhana Elite Fitness - Downtown')
        category = data.get('category', 'Gym Facilities')
        trainer_name = data.get('trainer_name', 'Alex Vance')

        if not comment:
            return jsonify({'success': False, 'message': 'Review comment cannot be empty'}), 400

        new_review = {
            "id": len(MEMBER_REVIEWS) + 1,
            "user_name": current_user.full_name or "Member",
            "user_avatar": (current_user.full_name or "M")[0].upper(),
            "branch_name": branch_name,
            "trainer_name": trainer_name,
            "category": category,
            "rating": rating,
            "date": str(date.today()),
            "title": title,
            "comment": comment,
            "helpful_count": 0,
            "response": "Thank you for sharing your feedback! Our management team reviews all insights to elevate member experience."
        }
        MEMBER_REVIEWS.insert(0, new_review)

        return jsonify({
            'success': True,
            'message': 'Review submitted successfully! Thank you for your feedback.',
            'review': new_review
        }), 201

    avg_rating = round(sum(r['rating'] for r in MEMBER_REVIEWS) / max(1, len(MEMBER_REVIEWS)), 1)
    ratings_count = {
        5: len([r for r in MEMBER_REVIEWS if r['rating'] == 5]),
        4: len([r for r in MEMBER_REVIEWS if r['rating'] == 4]),
        3: len([r for r in MEMBER_REVIEWS if r['rating'] == 3]),
        2: len([r for r in MEMBER_REVIEWS if r['rating'] == 2]),
        1: len([r for r in MEMBER_REVIEWS if r['rating'] == 1]),
    }

    return jsonify({
        'success': True,
        'reviews': MEMBER_REVIEWS,
        'average_rating': avg_rating,
        'total_reviews': len(MEMBER_REVIEWS),
        'breakdown': ratings_count
    }), 200


@member_bp.route('/notifications', methods=['GET', 'PUT'])
@role_required(['MEMBER'])
def member_notifications(current_user):
    if request.method == 'PUT':
        data = request.json or {}
        notif_id = data.get('id')
        if notif_id:
            for n in MEMBER_NOTIFICATIONS:
                if n['id'] == notif_id:
                    n['is_read'] = True
        else:
            # Mark all as read
            for n in MEMBER_NOTIFICATIONS:
                n['is_read'] = True

        return jsonify({'success': True, 'message': 'Notifications updated'}), 200

    unread_count = len([n for n in MEMBER_NOTIFICATIONS if not n['is_read']])
    return jsonify({
        'success': True,
        'notifications': MEMBER_NOTIFICATIONS,
        'unread_count': unread_count
    }), 200


@member_bp.route('/ai-workout-finder', methods=['POST'])
@role_required(['MEMBER'])
def ai_workout_finder(current_user):
    data = request.json or {}
    goal = data.get('goal', 'MUSCLE_GAIN')
    level = data.get('level', 'INTERMEDIATE')
    equipment = data.get('equipment', 'FULL_GYM')
    muscle_focus = data.get('muscle_focus', 'FULL_BODY')
    duration = int(data.get('duration', 45))
    intensity = data.get('intensity', 'HIGH')

    # AI Exercise Knowledge Base
    exercise_matrix = {
        'CHEST': [
            {'name': 'Barbell Flat Bench Press', 'sets': 4, 'reps': '8-10', 'rest': 90, 'tempo': '3-0-1', 'note': 'Primary compound chest builder. Focus on retracted scapula.'},
            {'name': 'Incline Dumbbell Press', 'sets': 3, 'reps': '10-12', 'rest': 60, 'tempo': '2-1-1', 'note': 'Upper clavicular chest activation with full peak stretch.'},
            {'name': 'Cable Chest Flyes', 'sets': 3, 'reps': '12-15', 'rest': 45, 'tempo': '2-0-2', 'note': 'Constant tension and adduction at peak contraction.'},
            {'name': 'Push-Ups (Tempo / Deficit)', 'sets': 3, 'reps': '15-20', 'rest': 45, 'tempo': '2-1-1', 'note': 'Great bodyweight finisher for chest and anterior delts.'}
        ],
        'BACK': [
            {'name': 'Barbell Bent-Over Row', 'sets': 4, 'reps': '8-10', 'rest': 90, 'tempo': '2-1-1', 'note': 'Thickens latissimus dorsi, rhomboids, and mid-traps.'},
            {'name': 'Wide-Grip Lat Pulldown', 'sets': 3, 'reps': '10-12', 'rest': 60, 'tempo': '3-0-1', 'note': 'Drive elbows downwards to engage the outer lat sweep.'},
            {'name': 'Seated Cable Row', 'sets': 3, 'reps': '10-12', 'rest': 60, 'tempo': '2-1-2', 'note': 'Keep torso upright and squeeze shoulder blades together.'},
            {'name': 'Single-Arm Dumbbell Row', 'sets': 3, 'reps': '10-12', 'rest': 60, 'tempo': '2-0-1', 'note': 'Unilateral stability and deep lat stretch.'}
        ],
        'LEGS': [
            {'name': 'Barbell Back Squat', 'sets': 4, 'reps': '8-10', 'rest': 120, 'tempo': '3-1-1', 'note': 'King of leg compound exercises. Full depth at parallel.'},
            {'name': 'Romanian Deadlift (RDL)', 'sets': 3, 'reps': '10-12', 'rest': 90, 'tempo': '3-1-1', 'note': 'Hamstring and glute loading with hip hinge mechanics.'},
            {'name': 'Leg Press or Dumbbell Walking Lunges', 'sets': 3, 'reps': '12-15', 'rest': 60, 'tempo': '2-0-1', 'note': 'High quad pump and unilateral stability.'},
            {'name': 'Standing Calf Raises', 'sets': 4, 'reps': '15-20', 'rest': 45, 'tempo': '2-1-2', 'note': 'Full stretch at bottom and 2-second hold at peak.'}
        ],
        'SHOULDERS': [
            {'name': 'Standing Overhead Military Press', 'sets': 4, 'reps': '8-10', 'rest': 90, 'tempo': '2-1-1', 'note': 'Builds anterior and lateral deltoid mass and overhead power.'},
            {'name': 'Dumbbell Lateral Raises', 'sets': 4, 'reps': '12-15', 'rest': 45, 'tempo': '2-0-2', 'note': 'Crucial for boulder shoulders and upper body V-taper.'},
            {'name': 'Face Pulls with Rope', 'sets': 3, 'reps': '15-20', 'rest': 45, 'tempo': '2-1-2', 'note': 'Vital for rear delts and shoulder joint health.'}
        ],
        'ARMS': [
            {'name': 'Incline Dumbbell Bicep Curl', 'sets': 3, 'reps': '10-12', 'rest': 60, 'tempo': '2-1-1', 'note': 'Maximum long-head bicep stretch.'},
            {'name': 'Tricep Rope Overhead Extension', 'sets': 3, 'reps': '12-15', 'rest': 45, 'tempo': '2-0-1', 'note': 'Isolates the long head of the tricep.'},
            {'name': 'Hammer Curls', 'sets': 3, 'reps': '10-12', 'rest': 60, 'tempo': '2-0-1', 'note': 'Thickens brachialis and forearms.'}
        ],
        'CORE_CARDIO': [
            {'name': 'Hanging Leg Raises', 'sets': 3, 'reps': '12-15', 'rest': 45, 'tempo': '2-1-1', 'note': 'Lower abs and hip flexor development.'},
            {'name': 'Plank to Push-Up', 'sets': 3, 'reps': '45 secs', 'rest': 30, 'tempo': 'Steady', 'note': 'Core anti-extension and shoulder endurance.'},
            {'name': 'Assault Bike / Row Sprints', 'sets': 5, 'reps': '30s on / 30s off', 'rest': 30, 'tempo': 'Max Effort', 'note': 'High-intensity metabolic conditioning.'}
        ]
    }

    # Selected exercises based on muscle focus
    selected_exercises = []
    if muscle_focus == 'PUSH':
        selected_exercises = exercise_matrix['CHEST'][:2] + exercise_matrix['SHOULDERS'][:2] + [exercise_matrix['ARMS'][1]]
    elif muscle_focus == 'PULL':
        selected_exercises = exercise_matrix['BACK'][:3] + [exercise_matrix['SHOULDERS'][2], exercise_matrix['ARMS'][0], exercise_matrix['ARMS'][2]]
    elif muscle_focus == 'LEGS':
        selected_exercises = exercise_matrix['LEGS'] + [exercise_matrix['CORE_CARDIO'][0]]
    else: # FULL_BODY or default
        selected_exercises = [
            exercise_matrix['LEGS'][0],
            exercise_matrix['CHEST'][0],
            exercise_matrix['BACK'][0],
            exercise_matrix['SHOULDERS'][1],
            exercise_matrix['ARMS'][0],
            exercise_matrix['CORE_CARDIO'][0]
        ]

    # Adjust for Dumbbells / Home / Bodyweight
    if equipment in ['DUMBBELLS', 'BODYWEIGHT', 'RESISTANCE_BANDS']:
        for ex in selected_exercises:
            if 'Barbell' in ex['name']:
                ex['name'] = ex['name'].replace('Barbell', 'Dumbbell' if equipment == 'DUMBBELLS' else 'Bodyweight Tempo')
            if 'Cable' in ex['name']:
                ex['name'] = ex['name'].replace('Cable', 'Band / Dumbbell')

    # Warmup Drills
    warmups = [
        {'name': 'Cat-Cow & Thoracic Rotations', 'duration': '2 Minutes', 'focus': 'Spinal mobility and upper back activation'},
        {'name': 'World\'s Greatest Stretch', 'duration': '3 Minutes', 'focus': 'Hip flexor, groin, and hamstring dynamic priming'},
        {'name': 'Band Pull-Aparts & Arm Circles', 'duration': '2 Minutes', 'focus': 'Rotator cuff and deltoid warm-up'}
    ]

    # Estimated Burn
    est_calories = int(duration * (9.5 if intensity == 'EXTREME' else 7.5 if intensity == 'HIGH' else 6.0))

    return jsonify({
        'success': True,
        'ai_recommendation': {
            'title': f"AI Optimized {muscle_focus.replace('_', ' ').title()} Protocol",
            'strategy': f"Targeted {goal.replace('_', ' ').title()} strategy tailored for {level.title()} athlete utilizing {equipment.replace('_', ' ').title()}.",
            'est_calories': est_calories,
            'duration_minutes': duration,
            'intensity': intensity,
            'target_heart_rate': '135 - 165 BPM',
            'warmup': warmups,
            'exercises': selected_exercises,
            'cooldown': [
                {'name': 'Kneeling Lat & Chest Stretch', 'duration': '90 Seconds'},
                {'name': 'Seated Hamstring & Piriformis Release', 'duration': '2 Minutes'},
                {'name': 'Box Breathing (4-4-4-4)', 'duration': '2 Minutes', 'focus': 'Parasympathetic nervous system recovery'}
            ],
            'coach_tip': f"Maintain strict tempo on eccentrics. Rest {selected_exercises[0]['rest']}s between primary compound sets to optimize neural recovery."
        }
    }), 200
