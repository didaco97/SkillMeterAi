import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

# Get the path to static images
# Assuming this file is in backend/api/utils/, we go up two levels to backend/api/static
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_IMAGES_DIR = os.path.join(BASE_DIR, 'static', 'images')

def generate_certificate_pdf(user_name, course_title, completion_date, cert_id):
    """
    Generates a PDF certificate and returns the bytes content.
    """
    # Create PDF in memory
    buffer = io.BytesIO()
    
    # Create PDF with landscape orientation
    p = canvas.Canvas(buffer, pagesize=landscape(letter))
    width, height = landscape(letter)
    
    # Certificate background - elegant gradient effect with border
    p.setFillColor(colors.Color(0.98, 0.98, 0.98))
    p.rect(0, 0, width, height, fill=1, stroke=0)
    
    # Decorative border
    p.setStrokeColor(colors.Color(0.2, 0.2, 0.2))
    p.setLineWidth(3)
    p.rect(30, 30, width-60, height-60, fill=0, stroke=1)
    
    # Inner border
    p.setLineWidth(1)
    p.rect(40, 40, width-80, height-80, fill=0, stroke=1)
    
    # Add SkillMeter Logo (top left corner)
    logo_path = os.path.join(STATIC_IMAGES_DIR, 'logo.png')
    if os.path.exists(logo_path):
        p.drawImage(logo_path, 60, height - 85, width=50, height=50, preserveAspectRatio=True, mask='auto')
    
    # Add Rocketboy illustration (bottom right corner)
    rocketboy_path = os.path.join(STATIC_IMAGES_DIR, 'Rocketboy.png')
    if os.path.exists(rocketboy_path):
        p.drawImage(rocketboy_path, width - 160, 50, width=100, height=100, preserveAspectRatio=True, mask='auto')
    
    # Header - "CERTIFICATE OF COMPLETION"
    p.setFillColor(colors.Color(0.1, 0.1, 0.1))
    p.setFont("Helvetica-Bold", 36)
    p.drawCentredString(width/2, height - 100, "CERTIFICATE OF COMPLETION")
    
    # Decorative line
    p.setStrokeColor(colors.Color(0.3, 0.3, 0.3))
    p.setLineWidth(2)
    p.line(width/2 - 200, height - 115, width/2 + 200, height - 115)
    
    # "This is to certify that"
    p.setFont("Helvetica", 18)
    p.setFillColor(colors.Color(0.3, 0.3, 0.3))
    p.drawCentredString(width/2, height - 160, "This is to certify that")
    
    # User's name - prominent
    p.setFont("Helvetica-Bold", 32)
    p.setFillColor(colors.Color(0.1, 0.1, 0.1))
    p.drawCentredString(width/2, height - 210, user_name)
    
    # Decorative underline for name
    p.setLineWidth(1)
    name_width = p.stringWidth(user_name, "Helvetica-Bold", 32)
    p.line(width/2 - name_width/2 - 20, height - 220, width/2 + name_width/2 + 20, height - 220)
    
    # "has successfully completed"
    p.setFont("Helvetica", 18)
    p.setFillColor(colors.Color(0.3, 0.3, 0.3))
    p.drawCentredString(width/2, height - 260, "has successfully completed the course")
    
    # Course title
    p.setFont("Helvetica-Bold", 24)
    p.setFillColor(colors.Color(0.15, 0.15, 0.15))
    
    # Truncate if too long
    display_title = course_title
    if len(display_title) > 50:
        display_title = display_title[:47] + "..."
    p.drawCentredString(width/2, height - 305, f'"{display_title}"')
    
    # Completion date
    p.setFont("Helvetica", 14)
    p.setFillColor(colors.Color(0.4, 0.4, 0.4))
    
    # Format date if it's a datetime object, otherwise assume string or use now
    if isinstance(completion_date, datetime):
        date_str = completion_date.strftime("%B %d, %Y")
    elif completion_date:
        date_str = str(completion_date)
    else:
        date_str = datetime.now().strftime("%B %d, %Y")
        
    p.drawCentredString(width/2, height - 350, f"Completed on {date_str}")
    
    # Certificate ID
    p.setFont("Helvetica", 10)
    p.setFillColor(colors.Color(0.5, 0.5, 0.5))
    p.drawCentredString(width/2, 80, f"Certificate ID: {cert_id}")
    
    # SkillMeter branding
    p.setFont("Helvetica-Bold", 14)
    p.setFillColor(colors.Color(0.2, 0.2, 0.2))
    p.drawCentredString(width/2, 55, "SkillMeter AI Learning Platform")
    
    # Signature line (left)
    p.setLineWidth(1)
    p.line(width/2 - 250, 130, width/2 - 50, 130)
    p.setFont("Helvetica", 10)
    p.drawCentredString(width/2 - 150, 115, "Platform Director")
    
    # Signature line (right)
    p.line(width/2 + 50, 130, width/2 + 250, 130)
    p.drawCentredString(width/2 + 150, 115, "Date of Issue")
    
    p.showPage()
    p.save()
    
    # Get PDF from buffer safely
    buffer.seek(0)
    pdf_content = buffer.getvalue()
    buffer.close()
    
    return pdf_content
