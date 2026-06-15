FROM python:3.11-slim

# Hugging Face runs containers as a non-root user (UID 1000)
# We must create this user and give them ownership of the app directory
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set the working directory
WORKDIR /home/user/app

# Copy the requirements file first to leverage Docker cache
COPY --chown=user:user requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the application
COPY --chown=user:user . .

# Expose the port Hugging Face Spaces expects
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
