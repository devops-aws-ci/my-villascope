# My-Bankin' Dashboard

Tableau de bord personnel de gestion financière — Qonto, Bankin', Linxo, Banque Postale.

# A developper rapidement must have

- Import operations revolut "Export_Revolut_account-statement_2024-11-12_2026-03-25_fr-fr_95a198.xlsx"
- ecran etat actuelle, solde actuelle des comptes bancaires
- Automatisation de la recuperations des tranasactions csv depuis les sources linxo,qonto
- changer le composant de select file pour que sa fonctionne sur android
- export excel des donuts et items de la tab "par catrgorie"
- dans l'ecarn Mapping des categories , ajouter le pouvoir de creer une nouvelle categorie et aprres l'exporter importer
- ajouter des tag sur certains transaction (exemple bilan_2026 , )
- Creation nouveau compte bancaire (import/export)
- Pouvoir editer les nouvelles transactions dans l'import linxo 'editer libelle note categorie sosu-catg OK
- Tu peux ajouter la possibilité de  trier la table des transactions récurrents par 'Nb' et "Depenses"   OK

# My-Bankin' Bug

- Bug Vue groupée par libellé (désactivée, bug de crash)
- Fix du bug lorsque on applique une categorie et une sous-catgorie sur un groupe de transactions juste la sous-catgorie est enregstré apres export
- 

# Plus tard

- import mybank-in depuis local file ou depuis url http (goole drive ou pcloud drive ...) et export aussi sur cloud drive

# My-Bankin' Features backlog idées

idées classées par valeur ajoutée pour ton usage :
🔥 Haute valeur :

Évolution mensuelle — un graphique barres empilées (recharts BarChart) par mois montrant la répartition des dépenses par catégorie. Tu verrais instantanément les tendances : "mes dépenses PRO ont explosé en octobre" ou "le logement est stable". Un 4ème onglet "📊 Évolution" dans les tabs d'analyse.
Règles de catégorisation automatique — un moteur de règles "si libellé contient X → catégorie Y". Par exemple : FREE MOBILE → Internet, TV, télécom ou TRANSAVIA → Sorties voyages. Ça remplacerait le travail manuel de recatégorisation que tu fais souvent. Sauvegardable en JSON comme les mappings.
Budget par catégorie — définir un budget mensuel par catégorie parente (ex: "Vie courante : 1 500 €/mois") et afficher une jauge de progression avec alerte visuelle quand on dépasse 80% ou 100%.

⚡ Valeur moyenne :

Comparaison M vs M-1 — un petit widget qui compare le mois en cours avec le mois précédent : variation en € et % par catégorie, avec flèches vertes/rouges.
Détection de doublons — scan automatique des transactions avec même montant + même date ±2j pour signaler les potentiels doublons entre imports Linxo / Bankin' / Op. bancaires.
Solde par compte dans le temps — un graphique ligne montrant l'évolution du solde cumulé par compte bancaire, mois par mois.

🔧 À reprendre plus tard :

📦 Vue groupée par libellé (désactivée, bug de crash)
⚙️ Règles de catégorisation auto (priorité #2)
💰 Budget par catégorie + jauges (priorité #3)
📈 Comparaison M vs M-1 (priorité #4)
