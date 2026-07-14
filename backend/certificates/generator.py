from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io


def generate_certificate_pdf(student_name, course_title, instructor_name, certificate_code, issued_date):
    """
    Génère un certificat PDF en mémoire (BytesIO) — design simple mais professionnel.
    Retourne les bytes du PDF, prêts à être uploadés sur Cloudinary.
    """
    buffer = io.BytesIO()
    width, height = landscape(A4)
    c = canvas.Canvas(buffer, pagesize=landscape(A4))

    # Couleurs de marque (bleu profond + doré)
    primary_color = HexColor("#1E3A8A")
    accent_color = HexColor("#F59E0B")

    # Bordure décorative
    c.setStrokeColor(primary_color)
    c.setLineWidth(4)
    c.rect(1.2 * cm, 1.2 * cm, width - 2.4 * cm, height - 2.4 * cm)

    c.setStrokeColor(accent_color)
    c.setLineWidth(1)
    c.rect(1.6 * cm, 1.6 * cm, width - 3.2 * cm, height - 3.2 * cm)

    # Titre
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(primary_color)
    c.drawCentredString(width / 2, height - 4 * cm, "CERTIFICAT DE RÉUSSITE")

    # Sous-titre
    c.setFont("Helvetica", 16)
    c.setFillColor(HexColor("#374151"))
    c.drawCentredString(width / 2, height - 5.5 * cm, "Ce certificat est décerné à")

    # Nom de l'étudiant
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(accent_color)
    c.drawCentredString(width / 2, height - 7 * cm, student_name)

    # Texte du cours
    c.setFont("Helvetica", 15)
    c.setFillColor(HexColor("#374151"))
    c.drawCentredString(width / 2, height - 8.5 * cm, "pour avoir complété avec succès le cours")

    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(primary_color)
    c.drawCentredString(width / 2, height - 9.7 * cm, course_title)

    # Date + instructeur
    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor("#6B7280"))
    c.drawCentredString(width / 2, 4.5 * cm, f"Délivré le {issued_date}")
    c.drawCentredString(width / 2, 3.8 * cm, f"Instructeur : {instructor_name}")

    # Code de vérification
    c.setFont("Helvetica-Oblique", 9)
    c.drawCentredString(width / 2, 2.3 * cm, f"Code de vérification : {certificate_code}")

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer