FROM python:3.11-slim

# Hugging Face runs containers as a non-root user (UID 1000)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /home/user/app

# Copy the backend requirements first
COPY --chown=user:user backend/requirements.txt ./backend/

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r backend/requirements.txt

# Copy the rest of the backend application
COPY --chown=user:user backend/ ./backend/

# Change working directory to backend so uvicorn runs correctly
WORKDIR /home/user/app/backend

# Expose the port Hugging Face Spaces expects
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
