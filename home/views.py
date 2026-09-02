from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .forms import RegisterForm
from .models import Product, Category, Cart, CartItem


def home(request):
    products = list(Product.objects.values(
        'id',
        'name',
        'description',
        'price',
        'category_id',
        'image',
        'badge',
        'badge_class',
        'icon',
    ))

    categories = list(Category.objects.values(
        'id',
        'name',
        'icon',
    ))

    cart_items = []

    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()

        if cart:
            cart_items = list(
                CartItem.objects.filter(cart=cart).values(
                    'product_id',
                    'quantity',
                )
            )

    return render(request, 'home.html', {
        'products': products,
        'categories': categories,
        'cart_items': cart_items,
    })


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = RegisterForm()

    return render(request, 'registration/register.html', {
        'form': form
    })


@login_required
def add_to_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = int(request.POST.get('quantity', 1))

        product = get_object_or_404(Product, id=product_id)

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

        item.quantity = min(item.quantity, 10)
        item.save()

        return JsonResponse({
            'success': True,
            'quantity': item.quantity,
        })

    return JsonResponse({'success': False}, status=400)


@login_required
def update_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = int(request.POST.get('quantity', 1))

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        item = get_object_or_404(
            CartItem,
            cart=cart,
            product_id=product_id
        )

        quantity = max(1, min(10, quantity))

        item.quantity = quantity
        item.save()

        return JsonResponse({
            'success': True,
            'quantity': item.quantity,
        })

    return JsonResponse({'success': False}, status=400)


@login_required
def remove_from_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        CartItem.objects.filter(
            cart=cart,
            product_id=product_id
        ).delete()

        return JsonResponse({
            'success': True,
        })

    return JsonResponse({'success': False}, status=400)


@login_required
def clear_cart(request):
    if request.method == 'POST':
        cart = Cart.objects.filter(
            user=request.user
        ).first()

        if cart:
            cart.items.all().delete()

        return JsonResponse({
            'success': True,
        })

    return JsonResponse({'success': False}, status=400)
