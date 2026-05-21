import re

# Liste des nouvelles vidéos de @ozarkphea (ID | Titre)
new_videos = [
    ("Gsr-bVsgm34", "Book Of Life Chinese Wedding"),
    ("kltWfImqOy8", "Tao Te King Paris Foot Reverse"),
    ("mdQ-6QITKSk", "The Mask"),
    ("7uR9toFw9C4", "Moon - Eat The Moon - The Stranger"),
    ("lbJNrPI3w_k", "OZARKPHEA - ART PERFORMANCE"),
    ("dBy17Rx1mfc", "3 April 2026"),
    ("oK8CJqs4NXM", "18 février 2026")
]

with open('index.html', 'r') as f:
    content = f.read()

# On remplace les anciens liens YouTube par les nouveaux
# Pour l'instant, on va juste s'assurer que les liens vers la chaîne sont corrects
content = content.replace('youtube.com/c/ozarkphea', 'youtube.com/@ozarkphea')
content = content.replace('youtube.com/user/ozarkphea', 'youtube.com/@ozarkphea')

# On injecte le menu unifié dans la page vidéos aussi pour la cohérence
nav_html = '''
<nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-white/5 pb-4 mb-8 text-[10px] mono uppercase tracking-widest">
    <a href="/" class="hover:text-white transition-colors">Accueil</a>
    <a href="/videos" class="text-white font-bold">Vidéos</a>
    <a href="/manifeste-droits" class="hover:text-white transition-colors">Manifeste</a>
    <a href="/poeme" class="hover:text-white transition-colors">Poème</a>
    <a href="/presentation" class="hover:text-white transition-colors">Présentation</a>
    <a href="/sjj2-loi" class="hover:text-white transition-colors">Loi Humaine</a>
    <a href="https://links.sjj2.org" class="hover:text-white transition-colors">Liens</a>
    <a href="https://shop.sjj2.org" class="hover:text-white transition-colors">Boutique</a>
</nav>
'''

# On cherche un endroit pour insérer le menu (après le header ou au début du body)
if '<header' in content:
    content = content.replace('</header>', '</header>\n' + nav_html)
else:
    content = content.replace('<body>', '<body>\n' + nav_html)

with open('videos_final.html', 'w') as f:
    f.write(content)
