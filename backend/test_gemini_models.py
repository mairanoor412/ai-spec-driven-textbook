"""
Test script to verify Gemini models available through OpenAI compatibility endpoint
"""
from openai import OpenAI
from app.config import settings

def test_gemini_connection():
    """Test connection and list available models"""
    client = OpenAI(
        api_key=settings.gemini_api_key,
        base_url=settings.openai_api_base
    )

    print("Testing Gemini OpenAI Compatibility Endpoint")
    print("=" * 60)
    print(f"Base URL: {settings.openai_api_base}")
    print(f"Configured Model: {settings.gemini_model}")
    print()

    # Test 1: Try to list models (if supported)
    try:
        print("Attempting to list available models...")
        models = client.models.list()
        print("\nAvailable models:")
        for model in models.data:
            print(f"  - {model.id}")
    except Exception as e:
        print(f"Note: Model listing not supported or failed: {e}")

    print()

    # Test 2: Try a simple chat completion with configured model
    print(f"Testing chat completion with model: {settings.gemini_model}")
    try:
        response = client.chat.completions.create(
            model=settings.gemini_model,
            messages=[
                {"role": "user", "content": "Say 'Hello, test successful!' if you can read this."}
            ],
            max_tokens=50
        )

        print("✓ SUCCESS!")
        print(f"Response: {response.choices[0].message.content}")
        print(f"Model used: {response.model}")

    except Exception as e:
        print("✗ FAILED!")
        print(f"Error: {str(e)}")
        print()

        # Test with alternative models
        alternative_models = [
            "gemini-2.0-flash",
            "gemini-2.5-flash",
            "gemini-1.5-flash-002",
            "gemini-1.5-flash-latest"
        ]

        print("Trying alternative models...")
        for alt_model in alternative_models:
            try:
                print(f"  Testing {alt_model}...", end=" ")
                response = client.chat.completions.create(
                    model=alt_model,
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=20
                )
                print(f"✓ WORKS! Response: {response.choices[0].message.content[:50]}")
                break
            except Exception as alt_error:
                print(f"✗ Failed: {str(alt_error)[:100]}")

if __name__ == "__main__":
    test_gemini_connection()
