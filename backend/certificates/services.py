import cloudinary.uploader
from django.utils import timezone
from .models import Certificate
from .generator import generate_certificate_pdf


def generate_certificate(student, course):
    """
    Génère un certificat PDF pour un étudiant ayant terminé un cours,
    l'upload sur Cloudinary et sauvegarde l'entrée en base.
    Ne génère qu'une seule fois par (student, course).
    """
    # Évite les doublons si la fonction est appelée plusieurs fois
    if Certificate.objects.filter(student=student, course=course).exists():
        return Certificate.objects.get(student=student, course=course)

    certificate = Certificate.objects.create(student=student, course=course)

    pdf_buffer = generate_certificate_pdf(
        student_name=student.get_full_name() or student.username,
        course_title=course.title,
        instructor_name=course.instructor.username,
        certificate_code=str(certificate.certificate_code),
        issued_date=timezone.now().strftime('%d/%m/%Y'),
    )

    result = cloudinary.uploader.upload(
        pdf_buffer,
        resource_type="raw",
        folder="certificates",
        public_id=f"certificate_{certificate.certificate_code}",
        format="pdf"
    )

    certificate.pdf_url = result['secure_url']
    certificate.save()

    return certificate