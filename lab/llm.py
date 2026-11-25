"""Appel OpenRouter minimal, avec le COÛT RÉEL renvoyé par l'API (usage.cost).

    r = call("z-ai/glm-5.2", prompt)
    r["text"], r["in"], r["out"], r["cost"]

Pas de cache : on veut le coût réel de chaque run dans le journal d'itérations.
"""
import json
import os
import time
import urllib.error
import urllib.request

URL = "https://openrouter.ai/api/v1/chat/completions"


def call(model, prompt, max_tokens=None, retries=2):
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        raise RuntimeError("OPENROUTER_API_KEY absente : `set -a && . ~/.hermes/.env && set +a`")
    body = {
        "model": model,
        "max_tokens": int(max_tokens or os.environ.get("MAX_TOKENS", 8000)),
        "reasoning": {"enabled": False},  # le raisonnement mange les tokens de sortie (réponses tronquées)
        "messages": [{"role": "user", "content": prompt}],
    }
    last = None
    for attempt in range(retries + 1):
        req = urllib.request.Request(
            URL, data=json.dumps(body).encode(),
            headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        )
        try:
            r = json.load(urllib.request.urlopen(req, timeout=int(os.environ.get("TIMEOUT", 300))))
        except urllib.error.HTTPError as e:
            last = RuntimeError(f"HTTP {e.code} {model} : {e.read().decode()[:300]}")
            if e.code in (400, 401, 403, 404):
                raise last  # inutile de réessayer
        except OSError as e:
            last = RuntimeError(f"{model} : {type(e).__name__} (timeout réseau)")
        else:
            u = r.get("usage", {})
            text = r["choices"][0]["message"].get("content") or ""
            if not text.strip():  # réponse vide : on retente une fois avant d'abandonner
                last = RuntimeError(f"{model} : réponse vide")
            else:
                return {"text": text, "in": u.get("prompt_tokens", 0), "out": u.get("completion_tokens", 0),
                        "cost": u.get("cost") or 0.0, "model": r.get("model", model)}
        time.sleep(2 + attempt * 3)
    raise last
