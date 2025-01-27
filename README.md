# Instalation et lancement d'Elasticsearch (Windows)
    - Installez Elasticsearch sur le site officiel
    - Dans un terminal, allez dans le dossier dezipper d'Elasticsearch
    - Lancez la commande : bin\elasticsearch.bat

    - Si cela ne marche pas, accédez au fichier elasticsearch.yml dans le dossier config d'Elasticsearch
    - Modifiez cette ligne comme suit : "xpack.security.enabled: false"


# Lancement du backend
    - Dans un terminal, allez dans le dossier Backend du projet
    - Lancez les commandes : npm install puis node src/index.js

# Lancement du frontend
    - Dans un terminal, allez dans le dossier frontend du projet
    - Lancez les commandes : npm install puis npm run dev# react-project
