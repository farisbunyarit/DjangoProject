from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.forms import SetPasswordForm

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .forms import RegisterForm, UserEditForm
from .models import (
    Product,
    Category,
    Cart,
    CartItem,
    Conversation,
    Message,
)
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    UserSerializer,
)

from .ai_service import ask_ai


# =========================
# HOME
# =========================

def home(request):

    products = list(
        Product.objects.values(
            'id',
            'name',
            'description',
            'price',
            'category_id',
            'image',
            'badge',
            'badge_class',
            'icon',
        )
    )

    categories = list(
        Category.objects.values(
            'id',
            'name',
            'icon',
        )
    )

    cart_items = []

    if request.user.is_authenticated:

        cart = Cart.objects.filter(
            user=request.user
        ).first()

        if cart:

            cart_items = list(
                CartItem.objects.filter(
                    cart=cart
                ).values(
                    'product_id',
                    'quantity',
                )
            )

    return render(
        request,
        'home.html',
        {
            'products': products,
            'categories': categories,
            'cart_items': cart_items,
        }
    )


# =========================
# REGISTER
# =========================

def register(request):

    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':

        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('login')

    else:

        form = RegisterForm()

    return render(
        request,
        'registration/register.html',
        {
            'form': form
        }
    )


# =========================
# LOGIN REDIRECT
# =========================

def login_redirect(request):

    if not request.user.is_authenticated:
        return redirect('login')

    if request.user.is_staff:
        return redirect('admin_dashboard')

    return redirect('home')


# =========================
# ADMIN DASHBOARD
# =========================

@login_required
def admin_dashboard(request):

    if not request.user.is_staff:
        return redirect('home')

    products_count = Product.objects.count()
    categories_count = Category.objects.count()
    users_count = User.objects.count()

    return render(
        request,
        'admin/dashboard.html',
        {
            'products_count': products_count,
            'categories_count': categories_count,
            'users_count': users_count,
        }
    )


# =========================
# ADMIN USERS
# =========================

@login_required
def admin_users(request):

    if not request.user.is_staff:
        return redirect('home')

    users = User.objects.all().order_by('-date_joined')

    return render(
        request,
        'admin/users.html',
        {
            'users': users,
        }
    )


# =========================
# EDIT USER
# =========================

@login_required
def edit_user(request, user_id):

    if not request.user.is_staff:
        return redirect('home')

    user = get_object_or_404(
        User,
        id=user_id
    )

    if request.method == 'POST':

        form = UserEditForm(
            request.POST,
            instance=user
        )

        if form.is_valid():
            form.save()
            return redirect('admin_users')

    else:

        form = UserEditForm(
            instance=user
        )

    return render(
        request,
        'admin/edit_user.html',
        {
            'form': form,
            'user_obj': user,
        }
    )


# =========================
# CHANGE USER PASSWORD
# =========================

@login_required
def change_user_password(request, user_id):

    if not request.user.is_staff:
        return redirect('home')

    user = get_object_or_404(
        User,
        id=user_id
    )

    if request.method == 'POST':

        form = SetPasswordForm(
            user,
            request.POST
        )

        if form.is_valid():
            form.save()
            return redirect('admin_users')

    else:

        form = SetPasswordForm(
            user
        )

    return render(
        request,
        'admin/change_user_password.html',
        {
            'form': form,
            'user_obj': user,
        }
    )


# =========================
# DELETE USER
# =========================

@login_required
def delete_user(request, user_id):

    if not request.user.is_staff:
        return redirect('home')

    user = get_object_or_404(
        User,
        id=user_id
    )

    if user == request.user:
        return redirect('admin_users')

    if request.method == 'POST':
        user.delete()
        return redirect('admin_users')

    return render(
        request,
        'admin/delete_user.html',
        {
            'user_obj': user,
        }
    )


# =========================
# ADMIN PRODUCTS
# =========================

@login_required
def admin_products(request):

    if not request.user.is_staff:
        return redirect('home')

    products = Product.objects.select_related(
        'category'
    ).all()

    return render(
        request,
        'admin/products.html',
        {
            'products': products,
        }
    )


# =========================
# ADD PRODUCT
# =========================

@login_required
def add_product(request):

    if not request.user.is_staff:
        return redirect('home')

    categories = Category.objects.all()

    if request.method == 'POST':

        name = request.POST.get(
            'name',
            ''
        ).strip()

        description = request.POST.get(
            'description',
            ''
        ).strip()

        price = request.POST.get('price')

        category_id = request.POST.get('category')

        image = request.POST.get(
            'image',
            ''
        ).strip()

        badge = request.POST.get(
            'badge',
            ''
        ).strip()

        badge_class = request.POST.get(
            'badge_class',
            ''
        ).strip()

        icon = request.POST.get(
            'icon',
            ''
        ).strip()

        category = get_object_or_404(
            Category,
            id=category_id
        )

        Product.objects.create(
            name=name,
            description=description,
            price=price,
            category=category,
            image=image,
            badge=badge,
            badge_class=badge_class,
            icon=icon,
        )

        return redirect('admin_products')

    return render(
        request,
        'admin/add_product.html',
        {
            'categories': categories,
        }
    )


# =========================
# EDIT PRODUCT
# =========================

@login_required
def edit_product(request, product_id):

    if not request.user.is_staff:
        return redirect('home')

    product = get_object_or_404(
        Product,
        id=product_id
    )

    categories = Category.objects.all()

    if request.method == 'POST':

        product.name = request.POST.get(
            'name',
            ''
        ).strip()

        product.description = request.POST.get(
            'description',
            ''
        ).strip()

        product.price = request.POST.get(
            'price'
        )

        category_id = request.POST.get(
            'category'
        )

        product.category = get_object_or_404(
            Category,
            id=category_id
        )

        product.image = request.POST.get(
            'image',
            ''
        ).strip()

        product.badge = request.POST.get(
            'badge',
            ''
        ).strip()

        product.badge_class = request.POST.get(
            'badge_class',
            ''
        ).strip()

        product.icon = request.POST.get(
            'icon',
            ''
        ).strip()

        product.save()

        return redirect('admin_products')

    return render(
        request,
        'admin/edit_product.html',
        {
            'product': product,
            'categories': categories,
        }
    )


# =========================
# DELETE PRODUCT
# =========================

@login_required
def delete_product(request, product_id):

    if not request.user.is_staff:
        return redirect('home')

    product = get_object_or_404(
        Product,
        id=product_id
    )

    if request.method == 'POST':

        product.delete()

        return redirect('admin_products')

    return render(
        request,
        'admin/delete_product.html',
        {
            'product': product,
        }
    )


# =========================
# PRODUCT API
# =========================

@api_view(['GET'])
def product_api(request):

    products = Product.objects.all()

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# =========================
# CATEGORY API
# =========================

@api_view(['GET'])
def category_api(request):

    categories = Category.objects.all()

    serializer = CategorySerializer(
        categories,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# =========================
# USER API
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def user_api(request):

    users = User.objects.all().order_by(
        '-date_joined'
    )

    serializer = UserSerializer(
        users,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# =========================
# ADD TO CART
# =========================

@login_required
def add_to_cart(request):

    if request.method != 'POST':

        return JsonResponse(
            {'success': False},
            status=400
        )

    product_id = request.POST.get(
        'product_id'
    )

    try:

        quantity = int(
            request.POST.get(
                'quantity',
                1
            )
        )

    except (TypeError, ValueError):

        quantity = 1

    quantity = max(
        1,
        min(10, quantity)
    )

    product = get_object_or_404(
        Product,
        id=product_id
    )

    cart, created = Cart.objects.get_or_create(
        user=request.user
    )

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if created:
        item.quantity = quantity

    else:
        item.quantity += quantity

    item.quantity = min(
        10,
        item.quantity
    )

    item.save()

    return JsonResponse(
        {
            'success': True,
            'quantity': item.quantity,
        }
    )


# =========================
# UPDATE CART
# =========================

@login_required
def update_cart(request):

    if request.method != 'POST':

        return JsonResponse(
            {'success': False},
            status=400
        )

    product_id = request.POST.get(
        'product_id'
    )

    try:

        quantity = int(
            request.POST.get(
                'quantity',
                1
            )
        )

    except (TypeError, ValueError):

        quantity = 1

    quantity = max(
        1,
        min(10, quantity)
    )

    cart = get_object_or_404(
        Cart,
        user=request.user
    )

    item = get_object_or_404(
        CartItem,
        cart=cart,
        product_id=product_id
    )

    item.quantity = quantity

    item.save()

    return JsonResponse(
        {
            'success': True,
            'quantity': item.quantity,
        }
    )


# =========================
# REMOVE FROM CART
# =========================

@login_required
def remove_from_cart(request):

    if request.method != 'POST':

        return JsonResponse(
            {'success': False},
            status=400
        )

    product_id = request.POST.get(
        'product_id'
    )

    cart = get_object_or_404(
        Cart,
        user=request.user
    )

    CartItem.objects.filter(
        cart=cart,
        product_id=product_id
    ).delete()

    return JsonResponse(
        {
            'success': True,
        }
    )


# =========================
# CLEAR CART
# =========================

@login_required
def clear_cart(request):

    if request.method != 'POST':

        return JsonResponse(
            {'success': False},
            status=400
        )

    cart = Cart.objects.filter(
        user=request.user
    ).first()

    if cart:
        cart.items.all().delete()

    return JsonResponse(
        {
            'success': True
        }
    )


# =========================
# AI API
# =========================

@api_view(['POST'])
def ai_api(request):

    message = request.data.get('message')

    if not message:
        return Response(
            {
                'success': False,
                'error': 'Message is required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        # =========================
        # GET OR CREATE CONVERSATION
        # =========================

        conversation_id = request.data.get(
            'conversation_id'
        )

        conversation = None

        if conversation_id:

            conversation = Conversation.objects.filter(
                id=conversation_id
            ).first()

        if not conversation:

            conversation = Conversation.objects.create(
                user=request.user if request.user.is_authenticated else None,
                title=message[:50]
            )

        # =========================
        # SAVE USER MESSAGE
        # =========================

        Message.objects.create(
            conversation=conversation,
            role='user',
            content=message
        )

        # =========================
        # GET CONVERSATION HISTORY
        # =========================

        history = conversation.messages.order_by(
            'created_at'
        )

        messages = []

        for item in history:

            messages.append(
                {
                    'role': item.role,
                    'parts': [
                        {
                            'text': item.content
                        }
                    ]
                }
            )

        # =========================
        # ASK AI
        # =========================

        answer = ask_ai(messages)

        # =========================
        # SAVE AI MESSAGE
        # =========================

        Message.objects.create(
            conversation=conversation,
            role='assistant',
            content=answer
        )

        # =========================
        # RESPONSE
        # =========================

        return Response(
            {
                'success': True,
                'response': answer,
                'conversation_id': conversation.id
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:

        return Response(
            {
                'success': False,
                'error': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
