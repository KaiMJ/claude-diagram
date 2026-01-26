#!/usr/bin/env python3
"""Dynamic port discovery and configuration."""

import argparse
import json
import socket
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
PORTS_FILE = ROOT_DIR / ".ports.json"


def find_available_port(start: int = 8000, end: int = 9000) -> int:
    """Find first available port in range."""
    for port in range(start, end):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError(f"No available port in range {start}-{end}")


def read_ports() -> dict:
    """Read current port configuration."""
    if PORTS_FILE.exists():
        return json.loads(PORTS_FILE.read_text())
    return {}


def write_ports(backend: int | None = None, frontend: int | None = None) -> dict:
    """Write port configuration to .ports.json and frontend .env.local."""
    config = read_ports()

    if backend is not None:
        config["backend"] = backend
    if frontend is not None:
        config["frontend"] = frontend

    # Write .ports.json
    PORTS_FILE.write_text(json.dumps(config, indent=2) + "\n")

    # Write frontend/.env.local for Next.js
    if "backend" in config:
        env_local = ROOT_DIR / "frontend" / ".env.local"
        env_local.write_text(f"NEXT_PUBLIC_API_URL=http://127.0.0.1:{config['backend']}\n")

    return config


def main():
    parser = argparse.ArgumentParser(description="Port management for dev environment")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # find command
    find_parser = subparsers.add_parser("find", help="Find an available port")
    find_parser.add_argument("--start", type=int, default=8000)
    find_parser.add_argument("--end", type=int, default=9000)

    # set command
    set_parser = subparsers.add_parser("set", help="Set and save port config")
    set_parser.add_argument("--backend", type=int)
    set_parser.add_argument("--frontend", type=int)

    # get command
    get_parser = subparsers.add_parser("get", help="Get a port from config")
    get_parser.add_argument("key", choices=["backend", "frontend"])

    # init command - find and set backend port
    subparsers.add_parser("init", help="Initialize ports (find available and save)")

    args = parser.parse_args()

    if args.command == "find":
        print(find_available_port(args.start, args.end))

    elif args.command == "set":
        config = write_ports(backend=args.backend, frontend=args.frontend)
        print(json.dumps(config))

    elif args.command == "get":
        config = read_ports()
        if args.key in config:
            print(config[args.key])
        else:
            raise SystemExit(f"Port '{args.key}' not configured. Run 'init' first.")

    elif args.command == "init":
        backend_port = find_available_port(8000, 8100)
        config = write_ports(backend=backend_port)
        print(f"Backend port: {config['backend']}")


if __name__ == "__main__":
    main()
