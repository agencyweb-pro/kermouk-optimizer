# Script PowerShell — Génère icon.png et icon.ico pour KERMOUK OPTIMIZER
# Éclair orange (#FF6B00) sur fond noir
# Exécuter depuis le dossier desktop/ : powershell -ExecutionPolicy Bypass -File scripts\generate-icon.ps1

Add-Type -AssemblyName System.Drawing

$size = 256
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Fond noir
$g.Clear([System.Drawing.Color]::Black)

# Fond circulaire légèrement foncé
$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 20, 20))
$g.FillEllipse($brushBg, 8, 8, 240, 240)

# Contour orange
$penOutline = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 107, 0), 6)
$g.DrawEllipse($penOutline, 8, 8, 240, 240)

# Éclair orange (lightning bolt) — coordonnées pour 256x256
$orange = [System.Drawing.Color]::FromArgb(255, 107, 0)
$brush  = New-Object System.Drawing.SolidBrush($orange)

# Points de l'éclair (centrés dans 256x256)
$points = @(
    [System.Drawing.PointF]::new(152, 28),   # haut droit
    [System.Drawing.PointF]::new(96,  130),  # milieu gauche
    [System.Drawing.PointF]::new(136, 130),  # milieu centre
    [System.Drawing.PointF]::new(104, 228),  # bas gauche
    [System.Drawing.PointF]::new(160, 126),  # milieu bas droit
    [System.Drawing.PointF]::new(120, 126)   # milieu bas centre
)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddPolygon($points)
$g.FillPath($brush, $path)
$g.Dispose()

# Dossier resources/
$resourcesDir = Join-Path $PSScriptRoot "..\resources"
if (-not (Test-Path $resourcesDir)) {
    New-Item -ItemType Directory -Path $resourcesDir | Out-Null
}

# Sauvegarder PNG
$pngPath = Join-Path $resourcesDir "icon.png"
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "PNG généré : $pngPath"

# Créer ICO depuis l'icône GDI+
$iconPath = Join-Path $resourcesDir "icon.ico"
$hIcon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream($iconPath, [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$bmp.Dispose()

Write-Host "ICO généré : $iconPath"
Write-Host "Icone KERMOUK OPTIMIZER cree avec succes !"
