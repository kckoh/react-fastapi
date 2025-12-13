# react-fastapi
alembic revision --autogenerate -m "add age column"

  # 3. Apply migration
  alembic upgrade head

  # 4. Verify
  docker compose exec postgres psql -U postgres -d mydb -c "\d users"
