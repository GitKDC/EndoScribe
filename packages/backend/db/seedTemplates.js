const templates = [
  // ─────────────────────────────────────────────────────────────────────
  // 1. Achalasia Cardia
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Achalasia Cardia",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Dilated with tertiary contractions+\nResistance at GE junction\nScope negotiable with slight difficulty",
      },
      { title: "Stomach", content: "Normal" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Advanced Imaging",
        content: "NBI screening done",
        highlight: true,
      },
      {
        title: "Impression",
        content:
          "Dilated tortuous esophagus with tertiary contractions – ?Achalasia Cardia",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 2. Atrophic Gastritis
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Atrophic Gastritis",
    category: "UGI",
    sections: [
      { title: "Esophagus", content: "Normal" },
      {
        title: "Stomach",
        content:
          "Pale, thin, marble-like mucosa in gastric fundus & body with erosions in fundus",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Advanced Imaging",
        content: "NBI screening done",
        highlight: true,
      },
      {
        title: "Impression",
        content: "Atrophic gastritis with erosions in gastric fundus",
        highlight: true,
      },
      {
        title: "Procedure",
        content: "Gastric biopsy taken with Sydney protocol",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 3. Barrett's Esophagus
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Barrett's Esophagus",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Tiny mucosal breaks with ulcer at GE junction\nProjection of small reddish velvety mucosa at 35 cm",
      },
      {
        title: "Advanced Imaging (NBI)",
        content:
          "Dilated IPCLs Type I\nPatulous GE junction – Hill class II",
        highlight: true,
      },
      {
        title: "Stomach",
        content: "Multiple erosions in gastric antrum",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Erosions+" },
      {
        title: "Impression",
        content:
          "Short segment Barrett's esophagus – Prague class C2 M3\nPatulous GE junction – Hill class II\nAntral gastritis\nDuodenitis",
        highlight: true,
      },
      { title: "Procedure", content: "D2 biopsy taken" },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 4. Candida Esophagus
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Candida Esophagus",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content: "Multiple whitish plaques at 35 cm",
      },
      {
        title: "Advanced Imaging (NBI)",
        content: "Dilated IPCLs Type I",
        highlight: true,
      },
      {
        title: "Stomach",
        content: "Multiple erosions in gastric antrum",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content: "Esophageal candidiasis\nErosive antral gastritis",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 5. Carcinoma Esophagus
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Carcinoma Esophagus",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Noduloproliferative growth seen at 18 cm and extending up to 23 cm\nBiopsy taken",
      },
      {
        title: "Advanced Imaging (NBI)",
        content:
          "Dilated irregular vessels with amorphous surface – s/o malignancy",
        highlight: true,
      },
      { title: "Stomach", content: "Normal" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Noduloproliferative growth at upper esophagus – ?Carcinoma Esophagus\nBiopsy taken",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 6. Carcinoma Post Cricoid
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Carcinoma Post Cricoid",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Ulceroproliferative growth in post cricoid area\nScope not negotiable beyond",
      },
      {
        title: "Advanced Imaging (NBI)",
        content:
          "Dilated irregular vessels with amorphous surface – s/o malignancy",
        highlight: true,
      },
      { title: "Stomach", content: "Not seen" },
      { title: "Duodenal Cap", content: "Not seen" },
      { title: "IInd Part of Duodenum", content: "Not seen" },
      {
        title: "Impression",
        content:
          "Ulceroproliferative growth at post cricoid – ?Ca Post Cricoid",
        highlight: true,
      },
      { title: "Procedure", content: "Biopsy taken" },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 7. Carcinoma Stomach
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Carcinoma Stomach",
    category: "UGI",
    sections: [
      { title: "Esophagus", content: "Normal" },
      {
        title: "Stomach",
        content:
          "Ulceroproliferative growth in gastric cardia and gastric body extending up to antrum\nScope negotiable beyond",
      },
      {
        title: "Advanced Imaging (NBI)",
        content:
          "Dilated irregular vessels with amorphous surface – s/o malignancy",
        highlight: true,
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Ulceroproliferative growth in stomach – ?Ca Stomach\nBiopsy taken",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 8. Peptic Stricture (Esophagus)
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Peptic Stricture",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content: "Stricture at 30 cm\nMucosal breaks at GE junction",
      },
      {
        title: "Advanced Imaging (NBI)",
        content: "Dilated IPCLs Type I\nPatulous GE junction – Hill class III",
        highlight: true,
      },
      {
        title: "Stomach",
        content: "Multiple erosions in gastric antrum",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Stricture at lower esophagus – Peptic stricture\nChanges of reflux esophagitis\nPatulous GE junction – Hill class III\nAntral gastritis",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 9. Dilatation
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "UGI - Dilatation",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Stricture at 35 cm – Peptic stricture\nStricture dilated up to 15 mm with Savary-Gilliard dilator",
      },
      { title: "Stomach", content: "Normal" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Stricture at lower end of esophagus – Peptic stricture\nStricture dilated up to 15 mm with Savary-Gilliard dilator",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 10. Esophageal Varices + PHG
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Esophageal Varices + PHG",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content: "Large long columns of varices with red wale sign",
      },
      {
        title: "Stomach",
        content:
          "Erythematous, edematous, friable mucosa with mosaic pattern",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Grade III esophageal varices\nPortal hypertensive gastropathy",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 11. Foreign Body
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Foreign Body",
    category: "UGI",
    sections: [
      { title: "Esophagus", content: "Normal" },
      { title: "Stomach", content: "Normal" },
      {
        title: "Duodenal Cap",
        content:
          "Foreign body (Rs. 2 coin) in duodenal bulb\nForeign body removed with Roth net basket",
      },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Foreign body (Rs. 2 coin) in duodenal bulb\nForeign body removed with Roth net basket",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 12. Polypectomy
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Polypectomy",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Small mucosal break at GE junction\nPatulous GE junction – Hill class I",
      },
      {
        title: "Advanced Imaging (NBI)",
        content: "Dilated IPCLs Type I",
        highlight: true,
      },
      {
        title: "Stomach",
        content:
          "Large polyps in gastric body along lesser curvature\nAnother small polyp in gastric body",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Changes of reflux esophagitis\nPatulous GE junction – Hill class I\nLarge gastric polyps – ?Fundic gland polyps",
        highlight: true,
      },
      { title: "Procedure", content: "Polypectomy done" },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 13. Reflux Esophagitis – Los Angeles Grade A
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Reflux Esophagitis (LA Grade A)",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Small ulcer at GE junction\nPatulous GE junction – Hill class II",
      },
      {
        title: "Advanced Imaging (NBI)",
        content: "Dilated IPCLs Type I",
        highlight: true,
      },
      {
        title: "Stomach",
        content: "Multiple erosions in gastric antrum",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Few erosions+" },
      {
        title: "Impression",
        content:
          "Mild esophagitis – Los Angeles Grade A\nPatulous GE junction – Hill class II\nAntral gastritis",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 14. Mallory Weiss Tear
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Mallory Weiss Tear",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Large deep mucosal tear and adherent clot at GE junction\nFive hemoclips applied & hemostasis achieved",
      },
      {
        title: "Stomach",
        content:
          "Small hiatus hernia – Hill class IV\nMultiple erosions in gastric antrum",
      },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Large deep Mallory Weiss tear\nHemoclips applied & hemostasis achieved",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 15. Post Cricoid Foreign Body
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Post Cricoid Foreign Body",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Foreign body (metallic earring) impacted at post cricoid area\nForeign body extracted with rat tooth forcep\nSmall ulcer at foreign body impacted area in post cricoid",
      },
      { title: "Stomach", content: "Normal" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Impacted foreign body (metallic earring) at post cricoid area\nSmall ulcer at post cricoid area\nForeign body extracted with rat tooth forcep",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 16. Post Cricoid Dilatation
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Post Cricoid Dilatation",
    category: "UGI",
    sections: [
      {
        title: "DILATATION",
        content: "",
        isHeading: true,
      },
      {
        title: "Esophagus",
        content:
          "Stricture at post cricoid area\nStricture dilated up to 15mm with Savary-Gilliard dilator",
      },
      {
        title: "POST DILATATION",
        content: "",
        isHeading: true,
      },
      { title: "Esophagus", content: "Normal" },
      { title: "Stomach", content: "Normal" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Impression",
        content:
          "Post Cricoid Stricture – Plummer Vinson Syndrome\nStricture dilated up to 15mm with Savary-Gilliard dilator",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 17. Post Cricoid Stricture
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Post Cricoid Stricture",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Stricture at post cricoid area\nScope not negotiable beyond",
      },
      { title: "Stomach", content: "Not seen" },
      { title: "Duodenal Cap", content: "Not seen" },
      { title: "IInd Part of Duodenum", content: "Not seen" },
      {
        title: "Advanced Imaging",
        content: "BLI screening done",
        highlight: true,
      },
      {
        title: "Impression",
        content:
          "Post cricoid stricture – ?Plummer Vinson syndrome\nAdvice: Dilatation on follow-up",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 18. Reflux Esophagitis (Standard)
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Reflux Esophagitis",
    category: "UGI",
    sections: [
      {
        title: "Esophagus",
        content:
          "Tiny ulcer with mucosal breaks at GE junction\nPatulous GE junction – Hill class I",
      },
      {
        title: "Advanced Imaging (NBI)",
        content: "Dilated IPCLs Type I",
        highlight: true,
      },
      {
        title: "Stomach",
        content: "Few erosions in antrum of stomach",
      },
      { title: "Duodenal Cap", content: "Normal" },
      {
        title: "IInd Part of Duodenum",
        content: "Tiny ulcer with mucosal breaks",
      },
      {
        title: "Impression",
        content:
          "Changes of reflux esophagitis\nPatulous GE junction – Hill class I\nMild antral gastritis",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 19. Normal UGI Study
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Normal Study",
    category: "UGI",
    sections: [
      { title: "Esophagus", content: "Normal" },
      { title: "Stomach", content: "Normal" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      {
        title: "Advanced Imaging",
        content: "NBI screening done",
        highlight: true,
      },
      {
        title: "Impression",
        content: "Normal study",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 20. VLS Scopy
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "VLS Scopy – Normal",
    category: "VLS",
    sections: [
      { title: "Oropharynx", content: "Normal" },
      { title: "Vallecula and Epiglottis", content: "Normal" },
      { title: "Pyriform Fossa", content: "Normal" },
      { title: "Laryngeal Opening", content: "Normal" },
      {
        title: "Advanced Imaging",
        content: "NBI screening done",
        highlight: true,
      },
      {
        title: "Impression",
        content: "Normal VLS Scopy study",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // 21. Sigmoidoscopy – Normal
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Normal Study",
    category: "SIGMOIDOSCOPY",
    sections: [
      { title: "Rectum", content: "Normal" },
      { title: "Sigmoid Colon", content: "Normal" },
      { title: "Descending Colon", content: "Normal" },
      {
        title: "Advanced Imaging",
        content: "SPES screening done",
        highlight: true,
      },
      {
        title: "Impression",
        content: "Normal sigmoidoscopy study",
        highlight: true,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  // SIGMOIDOSCOPY
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Sigmoid Hemorrhoids",
    category: "SIGMOIDOSCOPY",
    sections: [
      {
        title: "Rectum",
        content: "Small Internal and external Hemorrhoids"
      },
      { title: "Sigmoid colon", content: "Normal" },
      { title: "Descending Colon", content: "Normal" },
      {
        title: "Impression",
        content: "Small Internal and External Hemorrhoids",
        highlight: true
      }
    ]
  },
  {
    name: "SRUS",
    category: "SIGMOIDOSCOPY",
    sections: [
      {
        title: "Rectum",
        content:
          "Small whitebase ulcer with edematous & Erythematous mucosa\nProlapsed mucosa+"
      },
      { title: "Sigmoid colon", content: "Normal" },
      { title: "Descending colon", content: "Normal" },
      {
        title: "Impression",
        content:
          "Small ulcer with Prolapsed Rectal mucosa\n-?Solitary Rectal Ulcer Syndrome (S.R.U.S)\nBiopsy Taken",
        highlight: true
      }
    ]
  },
  {
    name: "Ulcerative Colitis",
    category: "SIGMOIDOSCOPY",
    sections: [
      {
        title: "Rectum",
        content:
          "Loss of vascular pattern with increased mucosal granularity & friability with Multiple superficial ulcers in Distal Rectum"
      },
      {
        title: "Sigmoid colon",
        content:
          "Loss of vascular pattern with increased mucosal granularity & friability with Multiple superficial ulcers"
      },
      { title: "Descending colon", content: "Normal" },
      {
        title: "Impression",
        content:
          "-?Inflamatory Bowel Disease - Ulcerative Colitis\nUCEIS Score – 6/8\nMontreal Classification – E1\n• Biopsy Taken",
        highlight: true
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────────────
  // ERCP
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Ampullary adenoma",
    category: "ERCP",
    sections: [
      {
        title: "Procedure",
        content:
          "Large Bulky protruding Papilla\nSelective CBD Cannulation done\nCholangiogram Showed Dialated IHBR and proximal CBD with Tight short Distal CBD Stricture\nEndoscopic Biliary sphincterotomy done\nBiopsy Taken\n“Uromed” 10fr X 10cm Double pigtail plastic stent placed in CBD\nPus++"
      },
      {
        title: "Impression",
        content:
          "Obstructive Jaundice with Acute Cholangitis\nTight Distal CBD Stricture -? Ampullary adenoma\nUnderwent ERCP with Biliary stenting\n• Biopsy Taken",
        highlight: true
      }
    ]
  },
  {
    name: "CBD Stent Exchange",
    category: "ERCP",
    sections: [
      {
        title: "Procedure",
        content:
          "Previous Biliary stent in situ\nRemoved with Rattooth forcep\nCBD cannulated\nPrevious Biliary sphicterotomy present\nCholangiogram Showed - Mildly dialated CBD with mid CBD calculi with distal CBD stricture\nBalloon sweep done,stone could not be retrived due to distal CBD narrowing. 10fr x 7cm DPT plastic stent placed."
      },
      {
        title: "Impression",
        content:
          "Cholelithiasis and Choledocholithiasis\nS/p ERCP with Biliary Stenting Underwent ERCP– CBD stent exchange done",
        highlight: true
      }
    ]
  },
  {
    name: "CCP PD Stenting",
    category: "ERCP",
    sections: [
      {
        title: "Procedure",
        content:
          "Narrowing at D1 and D2 junction\nPancreatic duct cannulated via mejor papilla\nPrevious Pancreatic sphincterotomy Extended\nPancreatogram showed Dilated irregular Pancreatic Duct with multiple calculi\nMultiple calculi flushed out\n07 fr X 10cm Single pigtail stent placed in Pancreatic Duct Across the Stricture"
      },
      {
        title: "Impression",
        content:
          "K/C/O Chronic Calcific Pancreatitis\nUnderwent ERCP with Pancreatic duct stent Exchange",
        highlight: true
      }
    ]
  },
  {
    name: "ERCP CBD Stent",
    category: "ERCP",
    sections: [
      {
        title: "Procedure",
        content:
          "Selective CBD cannulation done\nCholangiogram Showed – Grossly Dialated CBD with Multiple Large calculi\nEndoscopic Biliary sphincterotomy done\nEndoscopic Large Papillary Balloon Sphincteroplasty done\nBalloon sweep done and CBD cleared – Multiple large Calculi extracted\nBalloon Occlusion Cholangiogram Showed – Normal CBD\n“UROMED’s” 10fr X 10cm Double Pigtail plastic stent placed in CBD"
      },
      {
        title: "Impression",
        content:
          "Obstructive Jaundice with Acute Cholangitis\nCholedocholithiasis\nUnderwent ERCP with CBD clearance and Biliary stenting",
        highlight: true
      }
    ]
  },
  {
    name: "ERCP Stent Removal",
    category: "ERCP",
    sections: [
      {
        title: "Procedure",
        content:
          "Previous Biliary stent in situ\nRemoved with Rattooth forcep\nCBD cannulated\nPrevious Biliary sphicterotomy present\nCholangiogram Showed - Mildly dialated CBD with Sludge\nBalloon sweep done and CBD cleared – Sludge extracted\nBalloon Occlusion Cholangiogram Showed – Normal CBD"
      },
      {
        title: "Impression",
        content:
          "C/o Cholelithiasis and Choledocholithiasis\nS/p ERCP with Biliary Stenting F/b Cholecystectomy Underwent ERCP with Biliary Stent removal & CBD clearance",
        highlight: true
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────────────
  // ENTEROSCOPY
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Normal Enteroscopy",
    category: "ENTEROSCOPY",
    sections: [
      {
        title: "Procedure",
        content:
          "Antegrade Enteroscopy done with Single Balloon Enteroscope\nSIF- Q180 & CO2 insufflation under propofol sedation"
      },
      { title: "Esophagus", content: "Normal" },
      { title: "Stomach", content: "Multiple erosions in Gastric Body" },
      { title: "Duodenal Cap", content: "Normal" },
      { title: "IInd Part of Duodenum", content: "Normal" },
      { title: "IIIrd Part Of Duodenum", content: "Normal" },
      { title: "Jejunum", content: "Normal - Jejunum seen upto 200cm" },
      {
        title: "Impression",
        content:
          "Normal Antegrade Enteroscopy\n• Jejunal Biopsies Taken",
        highlight: true
      }
    ]
  },
  {
    name: "Retrograde Enteroscopy",
    category: "ENTEROSCOPY",
    sections: [
      {
        title: "Procedure",
        content:
          "Retrograde Enteroscopy done with Single Balloon Enteroscope SIF- Q180 & CO2 insufflation under propofol"
      },
      { title: "Rectum", content: "Normal" },
      { title: "Sigmoid colon", content: "Normal" },
      { title: "Descending colon", content: "Normal" },
      { title: "Transverse colon", content: "Normal" },
      { title: "Ascending colon", content: "Normal" },
      { title: "Caecum", content: "Normal" },
      {
        title: "Terminal Ileum",
        content:
          "Tight Stricture at Distal Ileum with normal overlying mucosa , Biopsy Taken. Scope could not be Negotiated beyond."
      },
      {
        title: "Impression",
        content:
          "Tight Stricture with Ulcer In Distal Ileum ? Inflammetory Bowel Disease – Chron’s Disease\nBiopsy Taken",
        highlight: true
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────────────
  // COLONOSCOPY (FULL - ALL 6 TEMPLATES)
  // ─────────────────────────────────────────────────────────────────────
  {
    name: "Argon Plasma Coagulation",
    category: "COLONOSCOPY",
    sections: [
      { title: "ARGON PLASMA COAGULATION", isHeading: true },
      {
        title: "Rectum",
        content:
          "Large whitebase ulcer with Mucosal Edema & erythema\nProlaps mucosa+\nArgon Plasma Coagulation Done"
      },
      {
        title: "Sigmoid colon To Caecum",
        content: "Normal"
      },
      {
        title: "Terminal Ileum",
        content: "Normal, Ileum seen upto 30cm"
      },
      {
        title: "Des",
        content: ""
      },
      {
        title: "Impression",
        content:
          "K/c/o Solitary Rectal Ulcer Syndrome\nArgon Plasma Coagulation Done for S.R.U.S",
        highlight: true
      }
    ]
  },
  {
    name: "Colon Growth",
    category: "COLONOSCOPY",
    sections: [
      { title: "Rectum", content: "Normal" },
      { title: "Sigmoid colon", content: "Normal" },
      { title: "Descending colon", content: "Normal" },
      {
        title: "Transeverse colon",
        content:
          "Circumferential Ulceroproliferative growth significant luminal narrowing\nAdvanced imaging (NBI Image) Dialated irregular vessals with amorphous surface with s/o Malignancy\nScope not negotiable beyond"
      },
      { title: "Ascending colon", content: "Not seen" },
      { title: "Caecum", content: "Not seen" },
      { title: "Terminal ileum", content: "Not seen" },
      {
        title: "Advance Imaging",
        content: "NBI screening done"
      },
      {
        title: "Impression",
        content:
          "Ulceroproliferative growth in Transeverse Colon -? Ca Transeverse Colon\n– Biopsy taken",
        highlight: true
      }
    ]
  },
  {
    name: "Normal Colonoscopy",
    category: "COLONOSCOPY",
    sections: [
      { title: "Rectum", content: "Normal" },
      { title: "Sigmoid colon", content: "Normal" },
      { title: "Descending colon", content: "Normal" },
      { title: "Transeverse colon", content: "Normal" },
      { title: "Ascending colon", content: "Normal" },
      { title: "Caecum", content: "Normal" },
      { title: "Terminal ileum", content: "Normal" },
      {
        title: "Impression",
        content: "Normal study",
        highlight: true
      }
    ]
  },
  {
    name: "Polyp",
    category: "COLONOSCOPY",
    sections: [
      { title: "Rectum", content: "Normal" },
      {
        title: "Sigmoid colon",
        content: "Small Polyp at Sigmoid – Descending junction"
      },
      {
        title: "Descending colon",
        content: "Small Polyp"
      },
      { title: "Transeverse colon", content: "Normal" },
      { title: "Ascending colon", content: "Normal" },
      { title: "Caecum", content: "Normal" },
      {
        title: "Terminal ileum",
        content: "Normal, Ileum seen upto 30cm"
      },
      {
        title: "Impression",
        content:
          "Small Polyps in Sigmoid colon & Desecending colon\n• Advice :- Polypectomy",
        highlight: true
      }
    ]
  },
  {
    name: "Terminal Ileum Ulcer",
    category: "COLONOSCOPY",
    sections: [
      { title: "Rectum", content: "Normal" },
      { title: "Sigmoid colon", content: "Normal" },
      { title: "Descending colon", content: "Normal" },
      { title: "Transeverse colon", content: "Normal" },
      { title: "Ascending colon", content: "Normal" },
      { title: "Caecum", content: "Normal" },
      {
        title: "Terminal ileum",
        content: "superficeal ulcers, Ileum seen upto 30cm"
      },
      {
        title: "Impression",
        content:
          "superfeceal ulcers in Terminal ileum ? infective\n- Ileal Biopsy Taken",
        highlight: true
      }
    ]
  },
  {
    name: "Ulcerative Colitis",
    category: "COLONOSCOPY",
    sections: [
      {
        title: "Rectum",
        content:
          "Loss of vascular pattern with edematous & erythematous mucosa with increased mucosal granularity and Friability"
      },
      {
        title: "Sigmoid colon",
        content:
          "Loss of vascular pattern with edematous & erythematous mucosa with increased mucosal granularity and Friability"
      },
      { title: "Descending colon", content: "Normal" },
      { title: "Transeverse colon", content: "Normal" },
      { title: "Ascending colon", content: "Normal" },
      {
        title: "Caecum",
        content: "Normal, Poor Preparation"
      },
      {
        title: "Terminal ileum",
        content: "Normal, Ileum Seen upto 30cm"
      },
      {
        title: "Impression",
        content:
          "-?Inflamatory Bowel Disease - Ulcerative Colitis\nUCEIS Score – 6/8\nMontreal Classification – E2\n• Biopsy Taken",
        highlight: true
      }
    ]
  }
];

function seedTemplates(db) {
  // Check if templates already exist
  db.get("SELECT COUNT(*) as count FROM templates", [], (err, result) => {
    if (err) {
      console.error("❌ Error checking templates:", err);
      return;
    }

    if (result && result.count > 0) {
      console.log(`⚠️  Database already has ${result.count} templates. Skipping seed.`);
      return;
    }

    console.log("🌱 Seeding initial templates into database...");

    const stmt = db.prepare(
      "INSERT INTO templates (name, category, sections) VALUES (?, ?, ?)"
    );

    let inserted = 0;
    let errors = 0;

    templates.forEach((template) => {
      stmt.run(
        [template.name, template.category, JSON.stringify(template.sections)],
        function (err) {
          if (err) {
            console.error(`❌ Error inserting "${template.name}":`, err);
            errors++;
          } else {
            inserted++;
            console.log(`✅ [${template.category}] ${template.name}`);
          }

          if (inserted + errors === templates.length) {
            stmt.finalize();
            console.log(`\n🎉 Seed complete — ${inserted} inserted, ${errors} errors.`);
          }
        }
      );
    });
  });
}

module.exports = { seedTemplates };
