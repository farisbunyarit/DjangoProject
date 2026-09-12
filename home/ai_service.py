from google import genai
from django.conf import settings

from .models import Product


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def ask_ai(messages):
    products = Product.objects.select_related('category').all()

    products_text = "\n".join(
        [
            (
                f"- ID: {product.id} | "
                f"Name: {product.name} | "
                f"Description: {product.description} | "
                f"Price: ${product.price} | "
                f"Category: {product.category.name}"
            )
            for product in products
        ]
    )

    system_instruction = f"""
You are Gear Ratio AI, a helpful shopping assistant for a motorcycle parts store.

Your job is to help customers find motorcycle parts from the products that actually
exist in the store.

IMPORTANT:
- Only recommend products from the product list below.
- Do not invent products, prices, or specifications.
- If the requested part does not exist, clearly say that it is not currently available.
- Keep answers concise and helpful.
- Mention the product name and price when recommending something.
- Answer naturally in the same language as the customer when possible.

AVAILABLE PRODUCTS:
{products_text}
"""

    contents = [
        {
            "role": "user",
            "parts": [
                {
                    "text": system_instruction
                }
            ]
        }
    ]

    contents.extend(messages)

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=contents
    )

    return response.text
