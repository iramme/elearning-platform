import cloudinary.uploader
from rest_framework.exceptions import ValidationError


# Extensions autorisées pour la sécurité
ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm']
ALLOWED_RESOURCE_EXTENSIONS = ['pdf', 'zip', 'docx', 'pptx', 'txt']
MAX_VIDEO_SIZE_MB = 500
MAX_RESOURCE_SIZE_MB = 50


def validate_file(file, allowed_extensions, max_size_mb):
    """Valide l'extension et la taille avant upload (sécurité)."""
    ext = file.name.split('.')[-1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(
            f"Extension '.{ext}' non autorisée. Formats acceptés : {', '.join(allowed_extensions)}"
        )
    size_mb = file.size / (1024 * 1024)
    if size_mb > max_size_mb:
        raise ValidationError(f"Fichier trop lourd ({size_mb:.1f}MB). Maximum : {max_size_mb}MB")


def upload_video_to_cloudinary(file, folder="courses/videos"):
    """
    Upload une vidéo vers Cloudinary.
    resource_type='video' est obligatoire pour les vidéos (sinon Cloudinary les traite comme des images).
    """
    validate_file(file, ALLOWED_VIDEO_EXTENSIONS, MAX_VIDEO_SIZE_MB)

    result = cloudinary.uploader.upload(
        file,
        resource_type="video",
        folder=folder,
        chunk_size=6_000_000,  # upload par morceaux de 6MB (recommandé pour vidéos)
    )
    return {
        'url': result['secure_url'],
        'public_id': result['public_id'],
        'duration': int(result.get('duration', 0)),
    }


def upload_resource_to_cloudinary(file, folder="courses/resources"):
    """Upload une ressource (PDF, ZIP...) vers Cloudinary."""
    validate_file(file, ALLOWED_RESOURCE_EXTENSIONS, MAX_RESOURCE_SIZE_MB)

    result = cloudinary.uploader.upload(
        file,
        resource_type="raw",  # 'raw' pour les fichiers non-image/vidéo
        folder=folder,
    )
    return {
        'url': result['secure_url'],
        'public_id': result['public_id'],
    }


def upload_thumbnail_to_cloudinary(file, folder="courses/thumbnails"):
    """Upload une image de couverture de cours."""
    result = cloudinary.uploader.upload(
        file,
        resource_type="image",
        folder=folder,
        transformation=[{'width': 800, 'height': 450, 'crop': 'fill'}]
    )
    return {
        'url': result['secure_url'],
        'public_id': result['public_id'],
    }


def delete_from_cloudinary(public_id, resource_type="video"):
    """Supprime un fichier Cloudinary (utile quand on supprime une leçon)."""
    cloudinary.uploader.destroy(public_id, resource_type=resource_type)