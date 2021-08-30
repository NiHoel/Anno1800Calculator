var languageCodes = {
    'en': 'english',
    'de': 'german',
    'fr': 'french',
    'ru': 'russian',
    'ko': 'korean',
    'ja': 'japanese',
    'zh': 'chinese',
    'it': 'italien',
    'es': 'spanish',
    'pl': 'polish'
}


texts = {
    allIslands: {
        "french": "Toutes les îles",
        "english": "All Islands",
        "italian": "Tutte le isole",
        "chinese": "所有岛屿",
        "spanish": "Todas las islas",
        "japanese": "すべての島",
        "taiwanese": "所有島嶼",
        "polish": "Wszystkie wyspy",
        "german": "Alle Inseln",
        "korean": "모든 섬",
        "russian": "Все острова"
    },
    residents: {
        "french": "Résidents",
        "english": "Residents",
        "italian": "Residenti",
        "chinese": "居民",
        "spanish": "Residentes",
        "japanese": "住民",
        "taiwanese": "居民",
        "polish": "Mieszkańcy",
        "german": "Einwohner",
        "korean": "주민",
        "russian": "Жители"
    },
    buildings: {
        "english": "Buildings",
        //"guid": 22659,
        "polish": "Budynki",
        "spanish": "Edificios",
        "taiwanese": "建築",
        "german": "Gebäude",
        "chinese": "建筑",
        "italian": "Edifici",
        "korean": "건물",
        "french": "Bâtiments",
        "japanese": "建物",
        "russian": "Сооружения"
    },
    skyscrapers: {
        "english": "Skyscrapers",
        //"guid": 131726,
        "spanish": "Rascacielos",
        "chinese": "摩天大楼",
        "korean": "마천루",
        "japanese": "高層ビル",
        "taiwanese": "摩天大樓",
        "french": "Gratte-ciel",
        "polish": "Wieżowce",
        "german": "Wolkenkratzer",
        "italian": "Grattacieli",
        "russian": "Небоскребы"
    },
    workforce: {
        english: "Required Workforce",
        german: "Benötigte Arbeitskraft",
        korean: "필요한 인력"
    },
    productionBoost: {
        "french": "Productivité",
        "brazilian": "Production",
        "english": "Productivity",
        "portuguese": "Production",
        "italian": "Produzione",
        "chinese": "生产力",
        "spanish": "Productividad",
        "japanese": "生産性",
        "taiwanese": "生產力",
        "polish": "Wydajność",
        "german": "Produktivität",
        "korean": "생산성",
        "russian": "Производительность"
    },
    reset: {
        "english": "Reset",
        "french": "Réinitialiser",
        "german": "Zurücksetzen",
        "korean": "재설정",
        "portuguese": "Reset",
        "brazilian": "Reset",
        "taiwanese": "重設",
        "chinese": "重设",
        "spanish": "Reiniciar",
        "italian": "Azzera",
        "russian": "Сбросить",
        "polish": "Wyzeruj",
        "japanese": "リセット"
    },
    itemsEquipped: {
        "english": "Items Equipped",
        "chinese": "已装备物品",
        "taiwanese": "已裝備物品",
        "italian": "Oggetti in uso",
        "spanish": "Objetos equipados",
        "german": "Ausgerüstete Items",
        "polish": "Przedmioty w użyciu",
        "french": "Objets en stock",
        "korean": "배치한 아이템",
        "japanese": "装備したアイテム",
        "russian": "Используемые предметы"
    },
    productionBuildings: {
        "english": "Production Buildings",
        "chinese": "生产建筑",
        "taiwanese": "生產建築",
        "italian": "Edifici produttivi",
        "spanish": "Edificios de producción",
        "german": "Produktionsgebäude",
        "polish": "Budynki produkcyjne",
        "french": "Bâtiments de production",
        "korean": "생산 건물",
        "japanese": "生産施設",
        "russian": "Производственные здания"
    },
    extraGoods: {
        "english": "Extra Goods",
        "chinese": "额外货物",
        "taiwanese": "額外貨物",
        "italian": "Merci aggiuntive",
        "spanish": "Bienes extra",
        "german": "Zusatzwaren",
        "polish": "Dodatkowe towary",
        "french": "Marchandises supplémentaires",
        "korean": "추가 물품",
        "japanese": "追加品物",
        "russian": "Дополнительные товары"
    },
    total: {
        "english": "Total",
        "chinese": "总计",
        "taiwanese": "總計",
        "italian": "Totale",
        "spanish": "Total",
        "german": "Gesamt",
        "polish": "Razem",
        "french": "Total",
        "korean": "합계",
        "japanese": "合計",
        "russian": "Всего"
    },
    "all": {
        "english": "All",
        "chinese": "全部",
        "taiwanese": "全部",
        "italian": "Tutti",
        "spanish": "Todo",
        "german": "Alle",
        "polish": "Wszystko",
        "french": "Toutes",
        "korean": "모두",
        "japanese": "すべて",
        "russian": "Все"
    },
    "effect": {
        "english": "Effect",
        "chinese": "效果",
        "taiwanese": "效果",
        "italian": "Effetto",
        "spanish": "Efecto",
        "german": "Effekte",
        "polish": "Efekt",
        "french": "Effet",
        "korean": "효과",
        "japanese": "効果",
        "russian": "Эффект"
    },
    "needConsumption": {
        "english": "Need Consumption",
        "chinese": "需求消耗程度",
        "taiwanese": "需求消耗程度",
        "italian": "Bisogno di consumo",
        "spanish": "Consumo de necesidad",
        "german": "Verbrauch der Bedürfnisse",
        "polish": "Potrzebna konsumpcja",
        "french": "Consommation du bien",
        "korean": "물품 요구량",
        "japanese": "需要の消費",
        "russian": "Потребление"
    },
    "newspaper": {
        "english": "Newspaper",
        "chinese": "报纸",
        "taiwanese": "報紙",
        "italian": "Giornale",
        "spanish": "Periódico",
        "german": "Zeitung",
        "polish": "Gazeta",
        "french": "Journal",
        "korean": "신문",
        "japanese": "新聞",
        "russian": "Газета"
    },
    "newspaperEffectiveness": {
        "english": "Newspaper Effectiveness",
        "chinese": "报纸效用",
        "taiwanese": "報紙效用",
        "italian": "Efficacia giornale",
        "spanish": "Efectividad del periódico",
        "german": "Effektivität der Zeitung",
        "polish": "Skuteczność gazety",
        "french": "Efficacité du journal",
        "korean": "신문 효과",
        "japanese": "新聞の効力",
        "russian": "Эффективность газеты"
    },
    "basicNeed": {
        "english": "Basic Need",
        //"guid": 11708,
        "polish": "Potrzeba podstawowa",
        "spanish": "Necesidad básica",
        "taiwanese": "基本需求",
        "german": "Grundbedürfnis",
        "chinese": "基本需求",
        "italian": "Bisogno di base",
        "korean": "생필품",
        "french": "Besoin fondamental",
        "japanese": "基本的な需要",
        "russian": "Базовая потребность"
    },
    "luxuryNeed": {
        "english": "Luxury Need",
        //"guid": 11706,
        "polish": "Potrzeba luksusowa",
        "spanish": "Necesidad de lujo",
        "taiwanese": "奢侈品",
        "german": "Luxusbedürfnis",
        "chinese": "奢侈品",
        "italian": "Bisogno di lusso",
        "korean": "사치품",
        "french": "Besoin de luxe",
        "japanese": "高級品の需要",
        "russian": "Потребность в роскоши"
    },
    "reducedNeeds": {
        "english": "Reduced Needs",
        "guid": 21387,
        "chinese": "减少需求物",
        "taiwanese": "減少需求物",
        "italian": "Bisogni ridotti",
        "spanish": "Necesidades reducidas",
        "german": "Bedürfnis-​Malus",
        "polish": "Zredukowane potrzeby",
        "french": "Besoins réduits",
        "korean": "요구량 감소",
        "japanese": "減少した需要",
        "russian": "Сниженные потребности"
    },
    "islands": {
        "english": "Islands",
        "chinese": "岛屿",
        "taiwanese": "島嶼",
        "italian": "Isole",
        "spanish": "Islas",
        "german": "Inseln",
        "polish": "Wyspy",
        "french": "Îles",
        "korean": "섬",
        "japanese": "島",
        "russian": "Острова"
    },
    "apply": {
        "english": "Apply",
        "chinese": "应用",
        "taiwanese": "套用",
        "italian": "Applica",
        "spanish": "Aplicar",
        "german": "Anwenden",
        "polish": "Zastosuj",
        "french": "Appliquer",
        "korean": "적용",
        "japanese": "適用",
        "russian": "Применить"
    },
    "confirm": {
        "english": "Confirm",
        //"guid": 118171,
        "chinese": "确认",
        "taiwanese": "確認",
        "italian": "Conferma",
        "spanish": "Confirmar",
        "german": "Bestätigen",
        "polish": "Potwierdź",
        "french": "Confirmer",
        "korean": "확인",
        "japanese": "認める",
        "russian": "Подтвердить"
    },
    "world": {
        "english": "The World",
        "chinese": "世界",
        "taiwanese": "世界",
        "italian": "Il mondo",
        "spanish": "El mundo",
        "german": "Die Welt",
        "polish": "Świat",
        "french": "Le Monde",
        "korean": "세계",
        "japanese": "世界",
        "russian": "Мир"
    },
    "deleteAll": {
        "english": "Delete All",
        "chinese": "删除全部",
        "taiwanese": "刪除全部",
        "italian": "Cancella tutto",
        "spanish": "Borrar todo",
        "german": "Alles löschen",
        "polish": "Skasuj wszystko",
        "french": "Supprimer tout",
        "korean": "모두 삭제",
        "japanese": "すべて削除する",
        "russian": "Удалить все"
    },
    "consumption": {
        "english": "Consumption",
        "chinese": "消耗",
        "taiwanese": "消耗",
        "italian": "Consumo",
        "spanish": "Consumo",
        "german": "Verbrauch",
        "polish": "Konsumpcja",
        "french": "Consommation",
        "korean": "소비량",
        "japanese": "消費",
        "russian": "Потребление"
    },
    "totalCapacity": {
        "english": "Total Capacity",
        "chinese": "总容量",
        "taiwanese": "總容量",
        "italian": "Capienza totale",
        "spanish": "Capacidad total",
        "german": "Gesamtkapazität",
        "polish": "Pojemność całkowita",
        "french": "Capacité totale",
        "korean": "총 수용량",
        "japanese": "総収容能力",
        "russian": "Общая вместимость"
    },
    "supplyEffects": {
        "english": "Supply Effects",
        // "guid": 11938,
        "polish": "Efekty zaopatrzenia",
        "spanish": "Efectos de suministro",
        "taiwanese": "供給效果",
        "german": "Versorgungseffekte",
        "chinese": "供给效果",
        "italian": "Effetti offerta",
        "korean": "공급 효과",
        "french": "Effets de l'approvisionnement",
        "japanese": "供給効果",
        "russian": "Влияние снабжения"
    },
    requiredNumberOfBuildings: {
        english: "Required Number of Buildings",
        german: "Benötigte Anzahl an Gebäuden",
        korean: "필요한 건물 수"
    },
    existingNumberOfBuildings: {
        english: "Existing Number of Buildings",
        german: "Vorhandene Anzahl an Gebäuden",
        korean: "현재 건물 수"
    },
    existingNumberOfBuildingsIs: {
        english: "Is:",
        german: "Ist:",
        korean: "현재:"
    },
    requiredNumberOfBuildings: {
        english: "Required:",
        german: "Benötigt:",
        korean: "필요:"
    },
    requiredNumberOfBuildingsDescription: {
        english: "Required number of buildings to produce consumer products",
        german: "Benötigte Gebäudeanzahl zur Produktion von Verbrauchsgütern",
        korean: "소비재 생산에 필요한 건물 수"
    },
    tonsPerMinute: {
        "english": "Tons per minute (t/min)",
        "chinese": "每分钟吨数（吨／分钟）",
        "taiwanese": "每分鐘噸數（噸／分鐘）",
        "italian": "Tonnellate al minuto (t/min)",
        "spanish": "Toneladas por minuto (t/min)",
        "german": "Tonnen pro Minute (t/min)",
        "polish": "Tony na minutę (t/min)",
        "french": "Tonnes par minute (t/min)",
        "korean": "톤/분(1분당 톤 수)",
        "japanese": "トン毎分 (トン/分)",
        "russian": "Тонн в минуту (т./мин.)"
    },
    publicBuildings: {
        "english": "Public Buildings",
        "polish": "Budynki użyteczności publicznej",
        "spanish": "Edificios públicos",
        "taiwanese": "公共建築",
        "german": "Öffentliche Gebäude",
        "chinese": "公共建筑",
        "italian": "Edifici pubblici",
        "korean": "공공건물",
        "french": "Bâtiments publics",
        "japanese": "公共施設",
        "russian": "Общественные здания"
    },
    outputAmount: {
        english: "Plain building output without extra goods",
        german: "Reiner Gebäudeoutput ohne Zusatzwaren",
    },
    extraNeed: {
        english: "Extra Demand",
        german: "Zusatzbedarf"
    },
    showIslandOnCreation: {
        english: "After creating a new island display it",
        german: "Nach dem Erstellen einer neuen Insel diese anzeigen"
    },
    applyGlobally: {
        english: "Apply Globally",
        german: "Global anwenden"
    },
    overproduction: {
        english: "Overproduction",
        german: "Überproduktion"
    },
    importDeficit: {
        english: "Import deficit",
        german: "Defizit importieren"
    },
    exportOverproduction: {
        english: "Export overproduction",
        german: "Überproduktion exportieren"
    },
    setTotalCapacity: {
        "english": "Set Total Capacity",
        "chinese": "Set 总容量",
        "taiwanese": "Set 總容量",
        "italian": "Set Capienza totale",
        "spanish": "Set Capacidad total",
        "german": "Setze Gesamtkapazität",
        "polish": "Set Pojemność całkowita",
        "french": "Set Capacité totale",
        "korean": "Set 총 수용량",
        "japanese": "Set 総収容能力",
        "russian": "Set Общая вместимость"
    },
    setTotalCapacityTooltip: {
        "english": "Multiply all contracts by such a factor that the total capacity equals this value.",
        "german": "Multipliziere all Verträge mit solch einem Faktor, dass die Gesamtkapazität diesem Wert entspricht.",
    },
    loadingSpeed: {
        "english": "Loading Speed",
        "chinese": "装货速度",
        "taiwanese": "裝貨速度",
        "italian": "Velocità caricamento",
        "spanish": "Velocidad de carga",
        "german": "Ladegeschwindigkeit",
        "polish": "Szybkość załadunku",
        "french": "Vitesse de chargement",
        "korean": "화물 선적 속도",
        "japanese": "積み込み速度",
        "russian": "Скорость погрузки"
    },
    duration: {
        "english": "Duration",
        "chinese": "持续时间",
        "taiwanese": "持續時間",
        "italian": "Durata",
        "spanish": "Duración",
        "german": "Dauer",
        "polish": "Czas trwania",
        "french": "Durée",
        "korean": "지속 시간",
        "japanese": "持続時間",
        "russian": "Длительность"
    },
    exportPyramid: {
        "english": "Your Specialty Exports",
        "polish": "Specjalizacje eksportowe",
        "spanish": "Tus especialidades de exportación",
        "taiwanese": "你的專屬出口貨物",
        "german": "Exportwaren-Pyramide",
        "chinese": "你的专属出口货物",
        "italian": "Le tue esportazioni di specialità",
        "korean": "전문 수출품",
        "french": "Vos exportations ",
        "japanese": "あなたの名産輸出品",
        "russian": "Специализация экспорта"
    },
    maxResidents: {
        "english": "Max. Residents",
        //"guid": 2322,
        "polish": "Maks. liczba mieszkańców",
        "spanish": "Residentes máx.",
        "taiwanese": "最大居民數量",
        "german": "Einwohner (max.)",
        "chinese": "最大居民数量",
        "italian": "Max. residenti",
        "korean": "최대 주민 수",
        "french": "Habitants max.",
        "japanese": "最大住民数",
        "russian": "Макс. кол-во жителей"
    },
    perHouse: {
        "english": "Per house",
        //"guid": 17435,
        "polish": "na dom",
        "spanish": "Por cada casa",
        "taiwanese": "每棟房屋",
        "german": "Pro Wohnhaus",
        "chinese": "每栋房屋",
        "italian": "Per dimora",
        "korean": "세대 당",
        "french": "Par maison",
        "japanese": "1件当たり",
        "russian": "За дом"
    },
    language: {
        "english": "Text Language",
        "chinese": "文本语言",
        "taiwanese": "文字語言",
        "italian": "Lingua testo",
        "spanish": "Idioma del texto",
        "german": "Textsprache",
        "polish": "Język napisów",
        "french": "Langue des textes",
        "korean": "텍스트 언어",
        "japanese": "テキスト言語",
        "russian": "Язык текста"
    },
    islandName: {
        english: "New island name",
        german: "Neuer Inselname",
        korean: "새로운 섬 이름"
    },
    selectedIsland: {
        english: "Selected Island",
        german: "Ausgewählte Insel",
        korean: "선택된 섬"
    },
    settings: {
        english: "Settings",
        german: "Einstellungen",
        korean: "설정"
    },
    help: {
        english: "Help",
        german: "Hilfe",
        korean: "도움말"
    },
    chooseFactories: {
        english: "Modify Production Chains",
        german: "Modifiziere Produktionsketten",
        korean: "생산 체인 수정"
    },
    noFixedFactory: {
        english: "Automatic: same region as consumer",
        german: "Automatisch: gleichen Region wie Verbraucher",
        korean: "자동 : 소비자와 동일한 지역"
    },
    consumptionModifier: {
        english: "Modify the percental amount of consumption for this tier and product",
        german: "Verändere die prozentuale Verbrauchsmenge für diese Ware und Bevölkerungsstufe",
        korean: "이 계층 및 제품의 사용량(백분율)을 수정하십시요"
    },
    useInput: {
        english: "Use as input on main page",
        german: "Verwende als Eingabe auf der Hauptseite"
    },
    // view mode
    viewMode: {
        english: "View Mode",
        german: "Ansichtsmodus"
    },
    viewSimple: {
        english: "Simple",
        german: "Einfach",
    },
    viewComplex: {
        english: "Complex",
        german: "Komplex"
    },
    viewComplete: {
        english: "Complete",
        german: "Vollständig"
    },
    viewSimpleDescription: {
        english: "Default settings tailored to beginners, complex mechanics hidden. Uses houses as input.",
        german: "Standardeinstellungen auf Einsteiger zugeschnitten, komplexe Mechaniken verborgen. Verwendet Häuser als Eingabe."
    },
    viewComplexDescription: {
        english: "Alle settings and mechanics available (as before).",
        german: "Alle Einstellungen und Mechaniken verfügbar (wie bisher)."
    },
    viewCompleteDescription: {
        english: "Identical to 'complex', but all extensions activated by default.",
        german: "Identisch zu 'komplex', aber alle Erweiterungen standardmäßig aktiviert."
    },
    // calculator and server managment
    download: {
        english: "Downloads",
        german: "Downloads",
        korean: "다운로드"
    },
    downloadConfig: {
        english: "Import / Export configuration.",
        german: "Konfiguration importieren / exportieren.",
        korean: "설정 가져오기 / 내보내기"
    },
    downloadCalculator: {
        english: "Download the calculator (source code of this website) to run it locally. To do so, extract the archive and double click index.html.",
        german: "Lade den Warenrechner (Quellcode dieser Seite) herunter, um ihn lokal auszuführen. Zum Ausführen, extrahiere das Archiv und doppelklicke auf index.html.",
        korean: "Anno 계산기 (이 웹 사이트의 소스 코드)를 다운로드 하여 로컬로 실행 하십시오. 압축을 풀고 index.html 실행 하십시오."
    },
    downloadCalculatorServer: {
        english: `Download a standalone executable that reads the current population count while playing the game. Usage:
1. Download server application and calculator (using the source code from above).
2. Start Anno 1800 with the graphics setting "Windowed Full Screen".
3. Start server (Server.exe) and open downloaded calculator (index.html) - make sure that Anno does not get minimized.
4. Expand the population statistics (global or island) or open the statistics screen (finance, production) to update the values in the calculator.

 See the following link for more information: `,
        german: `Lade eine ausführbare Datei herunter, die beim Spielen die aktuellen Bevölkerungszahlen erfasst. Verwendung:
1. Lade die Serveranwendung und den Warenrechner (siehe obiger Quellcode) herunter.
2. Starte Anno 1800 mit der Graphikeinstellung "Vollbild im Fenstermodus".
3. Führe den Server (Server.exe) aus und öffne den heruntergeladenen Warenrechner (index.html) - stelle sicher, dass Anno nicht minimiert wird.
4. Klappe die Bevölkerungsstatistiken (global oder inselweit) aus oder öffne das Statistikmenü (Finanzen, Produktion), um die Werte im Warenrechner zu aktualisieren.

Siehe folgenden Link für weitere Informationen: `,
        korean: `게임을 하는 동안 현재 인구 수를 읽는 실행 파일을 다운로드 하십시오. 방법:
1. 서버 프로그램 및 계산기를 다운로드 하십시오. (위의 소스 코드 사용).
2. Anno 1800을 실행 하십시오.
3. 서버 (Server.exe)를 실행하고 다운로드한 Anno1800 계산기 (index.html)를 엽니다.
4. 인구 통계 (모든 섬 또는 일부 섬)를 펼쳐서 열거나 통계 화면 (금융, 생산, 인구)을 열어 계산기의 값을 업데이트하십시오.
  자세한 내용은 다음 링크를 참조하십시오: `
    },
    serverUpdate: {
        english: "A new server version is available. Click the download button.",
        german: "Eine neue Serverversion ist verfügbar. Klicke auf den Downloadbutton.",
        korean: "새로운 서버 버전을 사용할 수 있습니다. 다운로드 버튼을 클릭하십시오."
    },
    calculatorUpdate: {
        english: "A new calculator version is available. Click the download button.",
        german: "Eine neue Version des Warenrechners ist verfügbar. Klicke auf den Downloadbutton.",
        korean: "새로운 Anno1800 계산기 버전이 제공됩니다. 다운로드 버튼을 클릭하십시오."
    },
    newFeature: {
        english: "Game Update 12: High Life. Please read the population configuration section in the help menu first.",
        german: "Game Update 12: Dächer der Stadt. Bitte den Abschnitt Bevölkerungskonfiguration im Hilfemenü zuerst lesen.",
    },
    helpContent: {
        german:
            `<h5>Verwendung und Aufbau</h5>
<p>Trage die aktuellen oder angestrebten Einwohner pro Stufe in die oberste Reihe ein. Die Produktionsketten aktualisieren sich automatisch, sobald man die Eingabe verlässt. Es werden nur diejenigen Fabriken angezeigt, die benötigt werden. In den Einstellungen kann zwischen der Eingabe von <b>Einwohnerzahl und Häusern</b> umgeschaltet werden. Im Fall von Einwohnern geht der Rechner davon aus, dass sämtliche Häuser voll sind.</p><br/>
<p>Der Buchstabe in eckigen Klammern vor dem Bevölkerungsnamen ist der <b>Hotkey</b> zum Fokussieren des Eingabefeldes. Die Anzahl dort kann ebenfalls durch Drücken der Pfeiltasten erhöht und verringert werden.</p><br/>
<p>In der darunterliegenden Reihe wird die <b>Arbeitskraft</b> angezeigt, die benötigt wird, um alle Gebäude zu betreiben (jeweils auf die nächste ganze Fabrik gerundet).</p><br/>
<p>Danach folgen zwei große Abschnitte, die sich wiederum in Unterabschnitte unterteilen. Der erste gibt einen <b>Überblick über alle benötigten Gebäude</b>, sortiert nach dem produzierten Warentyp. Der zweite schlüsselt die einzelnen <b>Produktionsketten nach Bevölkerungsstufen</b> auf. Jeder der Abschnitte kann durch einen Klick auf die Überschrift zusammengeklappt werden. Durch das Abwählen des Kontrollkästchens wird das entsprechende <b>Bedürfnis gesperrt</b>.</p><br/>
<p><span>In jeder Kachel wird der Name der Fabrik, das Icon der hergestellten Ware, der Boost für den Gebäudetyp, die Anzahl der benötigten Gebäude und die Produktionsrate in Tonnen pro Minute angezeigt. Die Anzahl der Gebäude wird, wenn aktiviert, mit zwei Nachkommastellen angezeigt, um die Höhe der Überkapazitäten direkt ablesen zu können. Daneben befinden sich zwei Buttons </span><span class="btn-group" role="group">
<button type="button" class="btn btn-secondary" style="padding: 0em 0.25em 0em 0.25em; font-size: unset;">+</button>
<button type="button" class="btn btn-secondary" style="padding: 0em 0.25em 0em 0.25em; font-size: unset;">-</button>
</span><span>. Diese versuchen den Boost so einzustellen, dass alle Gebäude des Typs bestmöglich ausgelastet sind und dabei ein Gebäude mehr (+) bzw. eines weniger (-) benötigt wird.</span></p>
<p>Der Abschnitt öffentliche Gebäude enthält nur diejenigen Gebäude, welche Waren verbrauchen. Die Rezepte aus dem Reisezeit-DLC sind dabei wie folgt umgesetzt. Jedes Rezept ist durch ein eigenes Gebäude repräsentiert. Um ein Rezept zum ersten Mal zu verwenden, muss es in der Liste ausgewählt und anschließend der Plus-Button geklickt werden. Es erscheint eine neue Kachel, die sich wie ein normales Produktionsgebäude verhält. Der einzige Unterschied besteht, wenn man die Gebäudezahl auf Null setzt. Dann verschwindet die Kachel und das Rezept wird wieder der Liste hinzugefügt.</p><br/>
<p>Da <b>Baumaterialien</b> sich Zwischenmaterialien mit Konsumgütern teilen sind sie (im Gegensatz zu Warenrechnern früherer Annos) mit aufgeführt, um so den Verbrauch von Minen besser planen zu können. Es muss die Anzahl der Endbetriebe per Hand eingegeben werden.</p><br/>

<h5>Bevölkerungskonfiguration</h5>
<img class="img-thumbnail img-responsive" src="ResidentHelp.png" />
<p>Der Button links oben bei den Bevölkerungsstufen öffnet ein separates Menü. Obige Grafik veranschaulicht, welche Werte aus dem Warenrechner welchen im Spiel entsprechen. Die "Pro Wohnhaus"-Einträge geben einen Durchschnittswert an und können folglich Nachkommastellen haben. Entsperrt man die Eingabe, dann wird der Wert aktualisiert, sobald ein neuer Gebäude- oder Bevölkerungswert eingegeben wird. Bei gesperrter Eingabe werden dagegen die anderen Einträge in der rechten Spalte so angepasst, dass Alles konsistent ist. Wird das Statistik-Auslese-Tool verwendet oder ist die Einstellungen aktiviert, dass die Einwohner pro Haus basierend auf erfüllten Bedürfnissen berechnet werden, dann muss die Eingabe gesperrt sein, sie wird aber trotzdem aktualisiert.</p>
<p>Die Radio-Buttons in der linken Spalte legen fest, welcher Wert auf der Hauptseite angezeigt wird. Die Buttons neben den Waren (ent-)sperren das Bedürfnis. Der Button <b>Global Anwenden</b> übernimmt beide pro-Haus-Einträge, gesperrte Bedürfnisse sowie die ausgewählten Verbrauchseffekte für alle Inseln.</p><br/>
<p>Durch Klick auf die Überschrift <b>Wolkenkratzer</b> werden die Wolkenkratzerlevel und der <b>Skyline Tower</b> angezeigt. In der <b>einfachen Ansicht</b> wird nur der Gebäudezähler angezeigt. Der Panoramaeffekt kann hier nicht berücksichtigt werden. In der komplexen Ansicht enthält jede Zeile die Anzahl an Gebäuden, das Einwohnerlimit pro Haus (5) sowie das Gesamtlimit (3) des Levels. Die Einwohnerzahl pro Haus muss manuell anhand des <b>Panoramaeffekts</b>, Items und weiterer Effekte geschätzt werden. Abgesehen von der Wolkenkratzerverwaltung unter Finanzen bietet das Spiel hier keine Hilfe. Es empfhielt sich, erst den pro-Haus-Wert anzpassen und danach die Gebäudeanzahl zu aktualisieren. So ist gewährleistet, dass das Bevölkerungslimit links korrekt aktualisiert wird. Vom Bevölkerungslimit hängt der Verbrauch ab, wie viele Einwohner dagegen aktuell in einem Wolkenkratzer leben ist unerheblich. Sobald ein Wolkenkratzer gebaut ist, fungieren die darüberstehenden Angaben als Zusammenfassung. So kann Einwohner (max.) pro Wohnhaus nicht mehr geändert werden und Einwohner pro Haus nicht mehr gesperrt. Damit sich die Eingabefelder aber ohne Wolkenkratzer wie bisher verhalten, war es nötig, reguläre Häuser mit aufzunehmen und deren Werte synchron zu halten. Änderungen in den oberen Eingabefeldern wirken sich folglich nur auf die Häuser aus und sollten vermieden werden.</p><br/>

<h5>Globale Einstellungen</h5>
<span class="btn-group bg-dark mr-2 float-left">
<button class="btn text-light"><span class="fa fa-adjust"> </span></button>
<button class="btn text-light"><span class="fa fa-cog"> </span></button>
<button class="btn text-light"><span class="fa fa-question-circle-o"> </span></button>
<button class="btn text-light"><span class="fa fa-download"> </span></button>
</span>
<p>Die Buttons rechts in der Navigationsleiste dienen zur Verwaltung des Warenrechners. Sie schalten in den Dark-Mode um, öffnen das Einstellungsmenü, zeigen die Hilfe oder öffnen den Download-Dialog. In den Einstellungen kann die Sprache ausgewählt und die Menge der dargestellten Informationen angepasst werden. Im <b>Downloadbereich</b> kann die <b>Konfiguration</b> (Einstellungen, Inseln, Boosts, Gebäude, ...) importiert und exportiert werden. Außerdem können dieser Rechner sowie eine zusätzliche Serveranwendung heruntergeladen werden. Mit der <b>Serveranwendung</b> lassen sich die Bevölkerungszahlen, vorhandenen Gebäude, Inseln und Produktivitäten automatisch aus dem Spiel auslesen.</p><br/>

<h5>Zeitung, Items und Produktionsketten</h5>
<span class="btn-group bg-dark mr-2 float-left">
<button type="button" class="btn"><img data-toggle="modal" data-target="#good-consumption-island-upgrade-dialog" class="icon-navbar" src="icon_newspaper.png" /></button>
<button class="btn text-light"><span class="fa fa-cogs"></span></button>
<button type="button" class="btn"><img data-toggle="modal" data-target="#item-equipment-dialog" class="icon-navbar" src="icon_add_goods_socket_white.png" /></button>
</span>
<p>Die Buttons hierfür befinden sich links in der Navigationsleiste. Zeitung und Zusatzwaren müssen allerdings erst in den Einstellungen aktiviert werden, da damit weitere Eingabefelder auf den Verbrauchs- bzw. Fabrikkacheln angezeigt werden.</p><br/>

<span class="btn-group bg-dark mr-2 float-left"><button type="button" class="btn"><img data-toggle="modal" data-target="#good-consumption-island-upgrade-dialog" class="icon-navbar" src="icon_newspaper.png" /></button></span>
<p>Neben der <b>Zeitung</b> können auch weitere Effekte eingestellt werden, welche den <b>Warenverbrauch verändern</b>, z. B. Zoo-Sets, Palasteffekte, Items und Effekte der öffentlichen Gebäude des Reisezeit-DLC. Nach dem Auswählen der Effekte, muss auf <b>Anwenden</b> geklickt werden, um den jeweils berechneten Wert bei allen Bedürfnissen einzutragen. Während Effekt und Items pro Insel aktiviert werden, hat die Zeitung globale Auswirkung. Um das Einstellen zu erleichtern, gibt es deshalb den <b>Global Anwenden</b>-Button, der sich verhält als würde man den <b>Anwenden</b>-Button auf jeder Insel betätigen. Wählt man in den Einstellungen <b>Verbrauch der Bedürfnisse basierend auf Effekten und Zeitung automatisch anpassen</b>, dann werden alle Änderungen sofort angewendet.</p><br/>

<div style="display:flex">
    <div class="card bg-light mr-2" style="min-width: 110px;"><div style="display: flex; justify-content: space-between; vertical-align: bottom;"><div><img class="icon-sm icon-light" src="icon_marketplace_2d_light.png"></div><div><button class="btn btn-light btn-sm"><span class="fa fa-sliders"></span></button></div></div><div class="input-group spinner" href="#" title="Verändere die prozentuale Verbrauchsmenge für diese Ware und Bevölkerungsstufe"><input class="form-control" type="number" value="100" step="0.1" min="1"><div class="input-group-append"><div class="input-group-btn-vertical"><button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button><button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button></div><span class="input-group-text">%</span></div></div></div>
    <p>Alternativ kann der Bonus auch pro Bedürfnis berechnet und eingestellt werden. Hierfür dienen die Eingabefelder im Abschnitt <b>Produktionsketten nach Bevölkerungsstufen</b>. Items, die den Verbrauch auf null senken, sind nicht aufgeführt. Stattdessen kann jedes einzelne Bedürfnis gesperrt werden.</p><br/>
</div><br/>

<span class="float-left btn-group bg-dark mr-2"><button class="btn text-light"><span class="fa fa-cogs"></span></button></span>
<p>Die Items sind in zwei Kategorien unterteilt. Zum einen solche, die <b>Eingangswaren ersetzen</b>. Im gleichen Dialog kann auch ausgewählt werden, von welcher Fabrik eine Ware hergestellt werden soll, falls es mehrere Möglichkeiten gibt. Standardmäßig ist die <b>Gleiche-Region-Regel</b> eingestellt. Exemplarisch besagt diese, dass das Holz für die Destillerien in der Neuen Welt, das Holz für Nähmaschinen aber in der Alten Welt produziert wird.</p><br/>

<div style="display:flex;align-items: flex-start;">
    <div style=" border-top: unset; border-top-right-radius: 0; border-top-left-radius: 0; min-width: 110px;" class="ui-fchain-item mr-2"> <div class="ui-fchain-item-load" style=" margin-top: 0; "> <div class="ui-fchain-item-extra-input"> <div class="input-group input-group-sm spinner mb-3"> <div class="input-group-prepend"> <span class="input-group-text">+ </span> <span style="display: none;"> <span class="fa fa-exclamation-triangle danger-icon"></span> </span> </div> <input step="0.1" class="form-control" type="number" value="5"> <div class="input-group-append"> <div><div class="input-group-btn-vertical"> <button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button> <button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button> </div></div> </div> </div> </div> <div href="#" data-toggle="tooltip" style="border-top-color: inherit; border-top-style: solid; border-top-width: 1px;" title="Reiner Gebäudeoutput ohne Zusatzwaren"> <div class="ui-fchain-item-load"><span>10</span><span> t/min</span></div> </div> </div> </div>
    <p>Zum anderen können Items mit <b>Zusatzwaren</b> berücksichtigt werden. Vorher muss aber die zugehörige Einstellung (Zusatzwaren) aktiviert werden. Mit der Option werden in den Fabrikkacheln zwei zusätzliche Informationen angezeigt: Ein Eingabefeld, das den <b>Zusatzbedarf</b> darstellt, welcher sich aus Importen / Exporten von Handelsrouten sowie den Zusatzwaren zusammensetzt. Da es sich um Bedarf handelt, werden die Zusatzwaren hier negativ eingetragen. Außerdem wird unter dem Strich der (benötigte) <b>Output der Fabrik</b> angezeigt (was im Ausgangslager der Fabrik erzeugt wird). Darin berücksichtigt sind der Bedarf auf der aktuellen Insel, Im- und Exporte. Nicht berücksichtigt sind Zusatzwaren aus Modulen und Palasteffekten, die auf magische Weise im Kontor landen.</p>
</div><br/>

<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"><img class="icon-navbar" src="icon_add_goods_socket_white.png" /></button></span>
<p>Zunächst muss festgelegt werden, welche Fabriken mit welchen Items ausgerüstet sind. Dies kann über das Einstellungsmenü (Button rechts oben an jeder Fabrik) geschehen oder über die Zusatzwaren-Itemübersicht, bei der die Fabriken per Checkbox ausgewählt werden können. Den <b>Ertrag der Zusatzwaren</b> wird bei den Fabriken angezeigt, die das Produkt normalerweise herstellen. Dort muss dann auf den Button <b>Anwenden</b> geklickt werden, um die Werte einzutragen und den neuen Bedarf zu berechnen. Zusatzwaren lassen sich durch die Checkbox aus der Berechnung herausnehmen. Dies ist notwendig, wenn mehrere Fabriken dasselbe Produkt herstellen, da andernfalls die Zusatzwaren mehrfach gutgeschrieben würden.</p><br/>
<p>Mit der Einstellung <b>automatisch anwenden</b> wird der <b>Zusatzbedarf</b> bei Änderung der Werte von <b>Zusatzwaren</b> oder <b>Handelsrouten</b> angepasst. Dabei ist allerdings Vorsicht geboten, da es in seltenen Fällen zu Endlosschleifen beim Updaten kommen kann. Dies kann sich dadurch ausdrücken, dass der Warenrechner nur sehr langsam reagiert oder Elemente flackern. In solchen Fällen empfiehlt es sich, das automatische Anwenden kurzzeitig zu deaktivieren. Sollte das Problem fortbestehen, exportieren Sie bitte die Konfiguration des Warenrechners, eröffnen  ein Issue auf GitHub (siehe unten) und fügen die Konfiguration an.</p><br/>
<p>Items, die in keine der beiden Kategorien fallen, sind aus Gründen der Übersichtlichkeit nicht aufgeführt. Der <b>Produktionsboost</b> muss z. B. komplett manuell ausgerechnet und eingetragen werden.</p><br/>

<h5>Inselverwaltung und Handelsrouten</h5>
<div class="input-group mb-2" style=" max-width: 300px; "> <div class="input-group-prepend"> <span class="input-group-text" >Selected Island</span> </div> <select name="islands" class="custom-select" ><option value="">All Islands</option></select> <div class="input-group-append"> <button class="btn btn-secondary" > <span class="fa fa-cog"> </span> </button> </div> </div>
<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"> <img class="icon-navbar" src="icon_map.png"> </button></span>
<p>Als erstes muss über das Zahnrad die <b>Inselverwaltung</b> geöffnet werden. Dort können dann neue Inseln erstellt werden. Wer den <b>Serveranwendung</b> verwendet, erhält dort Vorschläge für Inseln (basieren darauf, welche Inselnamen der Server im Statistikmenü gesehen hat). Mit dem Erstellen der ersten Insel werden in der Mitte der Navigationsleiste neue Bedienelemente angezeigt: Wechseln der Insel, Inselverwaltung öffnen und Handelsroutenmenü öffnen. Neue Inseln bekommen eine <b>Session</b> zugewiesen. Dies beeinflusst, welche Bevölkerungsstufen, Fabriken, Items und Verbrauchseffekte angezeigt werden. Der Button <b>Alles löschen</b> setzt den Warenrechner auf Werkseinstellungen zurück.</p><br/>


<p>Um Handelsrouten verwenden zu können, muss zunächst die entsprechende Einstellung aktiviert werden. Wie bei Zusatzwaren wird dann der Zusatzbedarf auf den Fabrikkacheln angezeigt. Siehe Abschnitt <b>Zusatzwaren</b> für genauere Erklärungen insbesondere für die Bedeutung des <b>Anwenden</b>-Buttons.</p><br/>
<div class="ui-fchain-item" style="width: 100%"> <div class="mb-3 inline-list-stretched" > <div class="custom-control custom-checkbox"> <input type="checkbox" class="custom-control-input" > <label class="custom-control-label" src-only="" style="vertical-align: top;" for="45-npcRoute-checked"> <img class="icon-sm" src="data:image/png;base64,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" > <span >Sir Archibald Blake</span> </label> </div> <div> <span >7</span> <span> t/min</span> </div> <div class="custom-control custom-checkbox"> <input type="checkbox" class="custom-control-input" > <label class="custom-control-label" src-only="" style="vertical-align: top;" for="77-npcRoute-checked"> <img class="icon-sm" src="data:image/png;base64,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" > <span >Old Nate</span> </label> </div> <div> <span >5</span> <span> t/min</span> </div> </div><table class="table table-striped table-sm" > <tbody ></tbody> </table> <form class="form form-inline" style="justify-content: space-between"> <select name="islands" class="custom-select" ><option value="">The Old World - Goldfurth</option></select> <div style="display: flex"> <div class="mr-2"> <img class="icon-sm icon-light" src="icon_transporter_loading_light.png"> </div> <div class="custom-control custom-switch"> <input type="checkbox" class="custom-control-input" > <label class="custom-control-label" for="create-trade-route-export-checkbox"> <img class="icon-sm icon-light" src="icon_transporter_unloading_light.png"> </label> </div> </div> <div class="input-group input-group-short spinner"> <input step="0.1" class="form-control" type="number" value="0" > <div class="input-group-append"> <span class="input-group-text">t/min</span> </div> </div> <button class="btn btn-sm btn-light" disabled=""> <span class="fa fa-plus"></span> </button> </form> </div>

<div class="float-left mr-2"> <button class="btn btn-light btn-sm" > <span class="fa fa-sliders"></span> </button> </div>
<p>Das <b>Erstellen von Handelsrouten</b> erfolgt über den <b>Konfigurationsdialog einer Fabrik</b>, die diese Ware normalerweise herstellt. Handelsrouten gibt es in zwei Ausführungen. Zum einen können Waren der <b>Händler eingekauft</b> werden. Durch Auswählen des Kästchens neben dem Händler wird die Route erstellt. Die zweite Möglichkeit ist ein <b>Warentransfer</b> zwischen Inseln. Wie bei Zusatzwaren werden dafür der Bedarf auf der einen Seiter erhöht und auf der anderen erniedrigt. Öffnet man den Dialog, wird die <b>Überproduktion</b> direkt in das Eingabefeld zum Erstellen einer neuen Handelsroute übernommen. Ändern sich Produktion oder Bedarf nachträglich, so werden neben geeigneten Handelsrouten Buttons angezeigt, um die Differenz zu übernehmen. Stellt man von Anfang an einen höheren Warentransfer ein als die Zielinsel verbraucht und ist <b>automatisch anwenden</b> aktiviert, so wird der (negative) Zusatzbedarf angepasst, wenn sich der Verbrauch auf der Zielinsel erhöht. Ein <span class="fa fa-exclamation-triangle " style="color:red"></span> im Eingabefeld weist daraufhin, dass die Quellinsel nicht genug produziert, um die Route vollständig zu bedienen.</p><br/>

<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"> <img data-toggle="modal" data-target="#trade-routes-management-dialog" class="icon-navbar" src="icon_shiptrade.png"> </button></span>
<p>Das Handelsroutenmenü enthält eine Übersicht über alle Handelsrouten, in der Reihenfolge der Erstellung. Dort können Handelsrouten außerdem gelöscht und die Transportmenge angepasst werden.</p><br/>
<span>Es gilt zu beachten, dass <b>Routen an Fabriken gekoppelt</b> sind. Dies bedeutet, dass der Import von derjenigen Fabrik erfolgen muss, von der es auf der anderen Insel produziert wird. Hierfür muss auf der importierenden Insel der Bedarf der richtigen Fabrik zugeordnet werden. Dies lässt sich über </span>
<span class="btn-group bg-dark">
<button class="btn text-light"><span class="fa fa-cogs"></span></button>
</span>
<span> in der Navigationsleiste einstellen. Andernfalls kann es z.B. passieren, dass vorhandene Gebäude bei Kohleminen eingetragen sind, der Bedarf aber bei Köhlereien anfällt. Grundsätzlich lässt sich schwer abbilden, wenn dieselbe Ware von verschiedenen Fabriktypen hergestellt wird. In solchen Fällen ist es empfehlenswert, sich im Warenrechner nur <b>auf einen Fabriktyp zu beschränken</b> und die Produktion der anderen per künstlicher Handelsroute von einer künstlichen Insel zu simulieren.</span><br/>
<br/>

<h5>Speicherstadt</h5>
<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"> <img class="icon-navbar" src="icon_docklands_2d_white.png"> </button></span>
<p>Die Speicherstadt bietet enormes Potential, Waren einzutauschen und sich auf effiziente Produktionen zu beschränken. Jedoch bietet das Spiel nur eingeschränkte Möglichkeiten, um die für den Export notwendigen Produktionskapazitäten zu berechnen. Im Warenrechner werden die Handelsverträge deshalb in t/min angegeben. Der Rechner ermittelt dann, wie viele Tonnen gehandelt werden müssen, um den gewünschten Warenfluss zu erreichen. Um das Feature verwenden zu können, muss es zunächst in den Einstellungen aktiviert werden. Anschließend erscheint - wie bei Handelsrouten und Zusatzwaren - das Eingabefeld für Zusatzbedarf, über den die Werte intern verrechnet werden. Das <b>Anlegen eines Vertrags</b> ähnelt dem einer Handelsroute. Im <b>Konfigurationsdialog einer Fabrik</b> werden die Warenmenge und das Tauschprodukt eingestellt. Mittels des Schiebereglers in der Mitte kann eingestellt werden, ob die Ware der ausgewählten Fabrik exportiert oder importiert werden. Wird kein Regler angezeigt, dann kann die Ware nicht importiert werden. <b>Beim Einstellen des Tauschprodukts taucht bei manchen Produkten ein zusätzliches Auswahlfeld auf.</b> Dort muss die Fabrik eingestellt werden, dem die Ware abgezogen bzw. zugeschrieben wird. Bei sämtlichen Auswahlfeldern kann durch Eingeben der Anfangsbuchstaben direkt zum Begriff gesprungen werden. Der Plus-Button erstellt die Route. Anschließend wird die Route in der Export-Fabrik und der Import-Fabrik angezeigt. Außerdem werden alle Verträge im Speicherstadt-Menü angezeigt. Mit einem Klick auf die Produkt-Icons kann zwischen den Menüs gewechselt werden.</p>
<p>Im oberen Bereich des Menüs wird die <b>Export-Pyramide</b> angezeigt und bearbeitet. Hierfür müssen ein Produkt und der Multiplikator ausgewählt und hinzugefügt werden. Zum Umsortieren müssen erst die alten Produkte gelöscht und mit anderen Multiplikatoren neu erstellt werden. Bereits eingestellte Verträge werden dann so angepasst, dass die importierten Tonnen pro Minute gleich bleiben.</p>
<p>Im unteren Bereich befindet sich die Übersicht über alle Verträge und zusammenfassende Informationen zum Handel. Hierfür muss als erstes die <b>Ladegeschwindigkeit des Piers</b> eingestellt werden, an dem Morris handelt. Die Information hierzu kann dem unteren Bereich des Anlegestellen-Infomenüs entnommen werden. Der Rechner ermittelt dann die Umschlagsdauer des Händlers, den Gesamtwarenumschlag in t/min, die benötigte Insellagerkapazität und die einzustellenden Tonnen pro Vertrag. Bei der Berechnung der Werte ist der Ladegeschwindigkeitsbonus des Händlers und die Dauer zum Betreten und Verlassen der Session bereits mit eingerechnet. Sollte dort ∞ stehen, dann übersteigt der eingestellte Warenumschlag den maximal möglichen des Händlers. Dann müssen die Verträge auf mehrere Inseln verteilt, die Ladegeschwindigkeit erhöht oder das Handelsvolumen reduziert werden</p>
<p>Es gibt noch einen weiteren Anwendungsfall, bei dem man pro Handel möglichst viele Waren tauschen möchte. Zuerst müssen dafür die Verträge eingerichtet und die Ladegeschwindigkeit angegeben werden. Die absolute Warenmenge ist dabei unerheblich, es kommt nur auf die relativen Unterschiede zwischen den Verträgen an. Anschließend muss die Insellagerkapazität eingetragen und daneben der Button <b>Setze Gesamtkapazität</b> geklickt werden. Der bestimmt die Ware, welche die meiste Lagerkapazität c benötigt. Der Vertrag wird um einen Faktor f skaliert, sodass c der Insellagerkapazität entspricht. Schließlich werden alle anderen Verträge ebenfalls mit f multipliziert.</p>
<p>Eine Besonderheit ergibt sich bei <b>Allen Inseln</b> (standardmäßig ausgewählt, wenn Inselverwaltung deaktiviert). Dort ist es erlaubt dieselbe Ware <b>zu importieren und exportieren</b>, um so Verträge für mehrere Speicherstädte zusammenfassen zu können. Allerdings werden keine zusammenfassenden Informationen zum Handel angezeigt.</p>
<br/>

<h5>Haftungsausschluss</h5>
<p>Der Warenrechner wird ohne irgendeine Gewährleistung zur Verfügung gestellt. Die Arbeit wurde in KEINER Weise von Ubisoft Blue Byte unterstützt. Alle Assets aus dem Spiel Anno 1800 sind © by Ubisoft.</p><br/>
<p>Darunter fallen insbesondere, aber nicht ausschließlich alle Icons, Bezeichnungen und Verbrauchswerte.</p><br/>

<p>Diese Software steht unter der MIT-Lizenz.</p><br/>

<h5>Autor</h5>
<p>Nico Höllerich</p>
<p>hoellerich.nico@freenet.de</p>
<br/>

<h5>Fehler und Verbesserungen</h5>
<span>Falls Sie auf Fehler oder Unannehmlichkeiten stoßen oder Verbesserungen vorschlagen möchten, erstellen Sie ein Issue auf GitHub (</span><a href="https://github.com/NiHoel/Anno1800Calculator/issues">https://github.com/NiHoel/Anno1800Calculator/issues</a><span>)</span>`,

        english:
            `<h5>Usage and Structure</h5>
<p>Enter the current or desired number of residents per level into the topmost row. The production chains will update automatically when one leaves the input field. Only the required factories are displayed. In the settings one can switch between <b>population and houses count</b>. In case of population count the calculator assumes that houses are full.</p><br/>
<p>The letter in square brackets before the resident's name is the <b>hotkey</b> to focus the input field. There, one can use the arrow keys to inc-/decrement the number.</p><br/>
<p>The row below displays the <b>workforce</b> that is required to run all buildings (rounded towards the next complete factory).</p><br/>
<p>Afterwards two big sections follow that are subdivided into smaller sections. The first one gives an <b>overview of the required buildings</b> sorted by the type of good that is produced. The second one lists the <b>individual production chains for each population level</b>. Clicking the heading collapses each section. Deselecting the checkbox leads to <b>locking the need</b>.</p><br/>
<p><span>Each card displays the name of the factory, the icon of the produced good, the boost for the given type of building, the number of required buildings, and the production rate in tons per minute. The number of buildings has two decimal places to directly show the amount of overcapacities. There are two buttons next to it.</span><span class="btn-group" role="group">
<button type="button" class="btn btn-secondary" style="padding: 0em 0.25em 0em 0.25em; font-size: unset;">+</button>
<button type="button" class="btn btn-secondary" style="padding: 0em 0.25em 0em 0.25em; font-size: unset;">-</button>
</span><span> Those try to adjust the boost such that all buildings operate at full capacity and one more (+) or one building less (-) is required.</span></p>
<p> The public buildings section lists all public services that consume goods. The recipe mechanic from the tourist season DLC is implemented as follows. Each recipe is a dedicated building. To add a recipe for the first time, select it from the dropdown and click the plus button. A new tile appears that behaves like a normal production building. The only difference is that by setting it to zero, the tile disappears and the recipe is re-added to the list.</p><br/>
<p>Since <b>construction materials</b> share intermediate products with consumables they are explicitly listed (unlike in calculators for previous Annos) to better plan the production of mines. The number of factories must be entered manually.</p><br/>

<h5>Population Configuration</h5>
<img class="img-thumbnail img-responsive" src="ResidentHelp.png" />
<p>The button top left of the population levels opens a dedicated menu. The above graphic illustrates which values from the calculator correspond to which values in the game. The "Per House" entries are an average value and can have decimals. After unlocking the field, its value gets updated whenever the value for buildings or residents is changed. If the field is locked, the other values in the right column are updated to be consistent. If the statistic extraction is used or the setting that residents per house are calculated based on fulfilled needs, then the field must be locked but gets updated.</p>
<p>The radio buttons in the left column determine which value is displayed on the main page. The buttons next to the goods lock/unlock the need. The button <b>Apply Globally</b> applies both per house entries, the locked needs, and all selected consumption effects to all islands.</p><br/>
<p>When clicking on the heading <b>Skyscrapers</b> the skyscraper levels and the <b>Skyline Tower</b> are shown. The <b>simple view</b> only shows the building counters. The panorama effect cannot be incorporated. The complex view shows the building counter, the residents limit per house (5), and the population limit of the level. On must manually estimate the number of residents per house based on the <b>panorama effect</b>, items and other effects. Except for the skyscraper maintenance in the finance screen, the game provides no help to estimate these values. It is recommended to set the per residence values before the number of buildings. This ensures that the population limit is updated correctly. The consumption depends on the population limit, whereas it is irrelevant how many residents live in a skyscraper. The upper input fields become summary fields once the first skyscraper is built. Thus, max. residents per house cannot be changed and the amount per residence not locked. That the input fields work without skyscrapers in the same way as before, it was necessary to add regular houses and sync their values with the summary fields. Changing the summary fields only affects the houses and should be avoided.</p><br/>

<h5>Global Settings</h5>
<span class="btn-group bg-dark mr-2 float-left">
<button class="btn text-light"><span class="fa fa-adjust"> </span></button>
<button class="btn text-light"><span class="fa fa-cog"> </span></button>
<button class="btn text-light"><span class="fa fa-question-circle-o"> </span></button>
<button class="btn text-light"><span class="fa fa-download"> </span></button>
</span>
<p>The buttons on the right of the navigation bar serve the purpose of managing the calculator. They toggle dark mode, open settings, show the help or open the download dialog. The language and the amount of displayed information can be adjusted in the settings. In the <b>download area</b> one can import and export the <b>configuration</b> (settings, islands, boost, buildings, ...). Moreover, this calculator and an additional server application can be downloaded. The <b>server application</b> reads population count, constructed buildings, islands, and productivity automatically from the game.</p><br/>

<h5>Newspaper, Items and Production Chains</h5>
<span class="btn-group bg-dark mr-2 float-left">
<button type="button" class="btn"><img data-toggle="modal" data-target="#good-consumption-island-upgrade-dialog" class="icon-navbar" src="icon_newspaper.png" /></button>
<button class="btn text-light"><span class="fa fa-cogs"></span></button>
<button type="button" class="btn"><img data-toggle="modal" data-target="#item-equipment-dialog" class="icon-navbar" src="icon_add_goods_socket_white.png" /></button>
</span>
<p>The buttons are found in the left of the navigation bar. Newspaper and extra goods need to be activated in the settings menu. The reason is that additional input fields will be displayed on the factory and consumption tiles.</p><br/>

<span class="btn-group bg-dark mr-2 float-left"><button type="button" class="btn"><img data-toggle="modal" data-target="#good-consumption-island-upgrade-dialog" class="icon-navbar" src="icon_newspaper.png" /></button></span>
<p>Apart from the <b>newspaper</b> other effects can be applied that <b>change the need consumption</b>, e.g. zoo sets, palace effects, items, and public building effects from the <b>tourist season DLC</b>. Having selected the effects, one must click <b>Apply</b> to enter the computed value into the consumption reduction input field. While effects and items are activated per island, the newspaper is global. The button <b>Apply globally</b> acts as if apply was clicked on every island. If you select <b>Automatically update need consumption based on effects and newspaper</b> in the settings, all changes are instantly applied.</p><br/>

<div style="display:flex">
    <div class="card bg-light mr-2" style="min-width: 110px;"><div style="display: flex; justify-content: space-between; vertical-align: bottom;"><div><img class="icon-sm icon-light" src="icon_marketplace_2d_light.png"></div><div><button class="btn btn-light btn-sm"><span class="fa fa-sliders"></span></button></div></div><div class="input-group spinner" href="#" title="Verändere die prozentuale Verbrauchsmenge für diese Ware und Bevölkerungsstufe"><input class="form-control" type="number" value="100" step="0.1" min="1"><div class="input-group-append"><div class="input-group-btn-vertical"><button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button><button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button></div><span class="input-group-text">%</span></div></div></div>
    <p>As an alternative the bonus can be computed and applied per need. The input fields in the section <b>production chains by population level</b> serve this purpose. Items that reduce consumption to zero are not included. Instead, one can lock each need.</p><br/>
</div><br/>

<span class="float-left btn-group bg-dark mr-2"><button class="btn text-light"><span class="fa fa-cogs"></span></button></span>
<p>The items are subdivided into two categories. The first category contains those items, that <b>replace input goods</b>. In the same dialog one can choose which product should be produced by which factory, in case several factories produce the same product. By default, the <b>same region policy</b> is selected. By example, this means that the wood for distilleries is produced in the New World while the wood for sewing machines is produced in the Old World.</p><br/>

<div style="display:flex;align-items: flex-start;">
    <div style=" border-top: unset; border-top-right-radius: 0; border-top-left-radius: 0; min-width: 110px;" class="ui-fchain-item mr-2"> <div class="ui-fchain-item-load" style=" margin-top: 0; "> <div class="ui-fchain-item-extra-input"> <div class="input-group input-group-sm spinner mb-3"> <div class="input-group-prepend"> <span class="input-group-text">+ </span> <span style="display: none;"> <span class="fa fa-exclamation-triangle danger-icon"></span> </span> </div> <input step="0.1" class="form-control" type="number" value="5"> <div class="input-group-append"> <div><div class="input-group-btn-vertical"> <button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button> <button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button> </div></div> </div> </div> </div> <div href="#" data-toggle="tooltip" style="border-top-color: inherit; border-top-style: solid; border-top-width: 1px;" title="Reiner Gebäudeoutput ohne Zusatzwaren"> <div class="ui-fchain-item-load"><span>10</span><span> t/min</span></div> </div> </div> </div>
    <p>The second category contains those items that generate <b>extra goods</b>. First, the corresponding setting (extra goods) needs to be activated. The option adds two pieces of information to the factory tiles: An input field that displays the <b>extra demand</b> which is put together form imports, exports, and extra goods. Since it is a demand extra goods are entered with negative values. The value below the line shows the (required) <b>factory output</b> (what is generated in the factory output storage). This includes the demand on the island, imports, and exports. It does not include extra goods from modules and place effects, which are magically transferred into the island storage.</p>
</div><br/>

<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"><img class="icon-navbar" src="icon_add_goods_socket_white.png" /></button></span>
<p>First, one must select with which items a factory is equipped. One can do this from the factory configuration dialog (button on the top right of the factory tile) or from the extra goods item overview, where each checkbox represents a factory. A factory that would normally produce this product shows the <b>gained extra goods</b>. There, one must click the <b>Apply</b> button to enter the values into extra demands and calculate the new demand. Extra goods can be excluded from calculation by unchecking the checkbox. This is necessary in case several factories produce the same good. Otherwise the gained extra goods would be added multiple times.</p><br/>
<p>If the setting <b>automatically apply</b> is active and the values for <b>gained extra goods</b> or <b>trade route imports/exports</b> change, the extra demand is automatically adjusted. But be careful when using this setting. In rare cases the calculator might caught up in an infinite loop to update the values. Effects are that the calculator responds slowly or elements flicker. In these cases, deactivate the setting briefly. If problems persist, please export the config, open an issue on GitHub (see below) and attach the config.</p><br/>
<p>Items that fall in neither of the two categories are not included for clarity. E.g. the <b>production boost</b> needs to be calculated and entered without any support.</p><br/>

<h5>Island and Trade Route Management</h5>
<div class="input-group mb-2" style=" max-width: 300px; "> <div class="input-group-prepend"> <span class="input-group-text" >Selected Island</span> </div> <select name="islands" class="custom-select" ><option value="">All Islands</option></select> <div class="input-group-append"> <button class="btn btn-secondary" > <span class="fa fa-cog"> </span> </button> </div> </div>
<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"> <img class="icon-navbar" src="icon_map.png"> </button></span>
<p>First, one must open the <b>island management dialog</b> by clicking the cogwheel. One can create new islands there. When using the <b>server application</b> suggestions for new islands get listed (based on those island names the server has seen on the statistics screen). After creating the first island three new control elements show up in the center of the navigation bar: Switch island, open island management, and open trade route management. New islands are associated with a <b>session</b>. The session influences which population levels, factories, items and need consumption effects show up. The button <b>Delete All</b> resets the calculator to its initial state.</p><br/>


<p>Enable the setting <b>trade routes</b> to create and manage them. Like when enabling extra goods, the <b>extra demand</b> input shows up on the factory tiles. See section <b>extra goods</b> for more information on extra demands and the function of the <b>Apply</b> button.</p><br/>
<div class="ui-fchain-item" style="width: 100%"> <div class="mb-3 inline-list-stretched" > <div class="custom-control custom-checkbox"> <input type="checkbox" class="custom-control-input" > <label class="custom-control-label" src-only="" style="vertical-align: top;" for="45-npcRoute-checked"> <img class="icon-sm" src="data:image/png;base64,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" > <span >Sir Archibald Blake</span> </label> </div> <div> <span >7</span> <span> t/min</span> </div> <div class="custom-control custom-checkbox"> <input type="checkbox" class="custom-control-input" > <label class="custom-control-label" src-only="" style="vertical-align: top;" for="77-npcRoute-checked"> <img class="icon-sm" src="data:image/png;base64,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" > <span >Old Nate</span> </label> </div> <div> <span >5</span> <span> t/min</span> </div> </div><table class="table table-striped table-sm" > <tbody ></tbody> </table> <form class="form form-inline" style="justify-content: space-between"> <select name="islands" class="custom-select" ><option value="">The Old World - Goldfurth</option></select> <div style="display: flex"> <div class="mr-2"> <img class="icon-sm icon-light" src="icon_transporter_loading_light.png"> </div> <div class="custom-control custom-switch"> <input type="checkbox" class="custom-control-input" > <label class="custom-control-label" for="create-trade-route-export-checkbox"> <img class="icon-sm icon-light" src="icon_transporter_unloading_light.png"> </label> </div> </div> <div class="input-group input-group-short spinner"> <input step="0.1" class="form-control" type="number" value="0" > <div class="input-group-append"> <span class="input-group-text">t/min</span> </div> </div> <button class="btn btn-sm btn-light" disabled=""> <span class="fa fa-plus"></span> </button> </form> </div>

<div class="float-left mr-2"> <button class="btn btn-light btn-sm" > <span class="fa fa-sliders"></span> </button> </div>
<p><b>Trade routes are created</b> from the <b>factory configuration dialog</b> of a factory that normally produces this product. There are two kinds of trade routes. The first kind are routes to <b>purchase goods from a trader</b>. Selecting the checkbox next to the trader creates such a route. The second kind are routes to <b>transfer goods between islands</b>. Like for extra goods, the extra demand is increased on one side and decreased on the other. When opening the factory configuration dialog, the calculator enters the <b>overproduction</b> into the amount input field for a new trade route. When production or island demand change, buttons show up next to suitable trade routes that allow to add the difference. Let us assume that one imports more goods than consumed on an island and that <b>automatically apply</b> is turned on. If the consumption on the island increases the extra demand will be updated automatically. A <span class="fa fa-exclamation-triangle " style="color:red"></span> on an input field signals that the source island does not produce enough to fully supply the trade route.</p><br/>

<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"> <img data-toggle="modal" data-target="#trade-routes-management-dialog" class="icon-navbar" src="icon_shiptrade.png"> </button></span>
<p>The trade route menu contains an overview of all trade routes, listed in the order of creation. One can delete trade routes and adjust their load there.</p><br/>
<span>Please note that <b>routes are attached to factories</b>. This means that an import must be configured on the factory that produces the good on the source island. The demand must therefore be associated with the correct factory on the importing island. The settings can be changed via </span>
<span class="btn-group bg-dark">
<button class="btn text-light"><span class="fa fa-cogs"></span></button>
</span>
<span> in the navigation bar. Otherwise it may happen that for instance existing coal mines produce sufficient goods, but the demand is associated with charcoal kilns. It is not possible to produce one input good for one factory by different other factories. One must <b>stick with one type of factory</b> and simulate the production of other factories by artificial trade routes from artificial islands.</span><br/>
<br/>

<h5>Docklands</h5>
<span class="float-left btn-group bg-dark mr-2"><button type="button" class="btn"> <img class="icon-navbar" src="icon_docklands_2d_white.png"> </button></span>
<p>Docklands offers an enormous potential to trade goods and to focus on efficient production chains. But the game provides limited information to compute the required production capacities required for the export. Therefore, trade contracts in the calculator are based on t/min. The calculator computes the amount in tons that must be entered into the in-game contract to achieve the desired flow of goods. There is a checkbox in the settings to activate the docklands feature. After activation, an input box for extra demand appears - as it does when activating extra goods or trade routes. The calculator uses extra demand internally to account for the effects of trade routes etc. <b>Creating a contract</b> is like creating a trade route. One configures the number of goods and the exchange product in the <b>factory configuration dialog</b>. The switch in the middle toggles between exporting and importing the product of the selected factory. If no switch is shown, the good cannot be imported. <b>When selecting particular exchange products, an additional selection box appears.</b> There, one has to choose the factory where the good is added or subtracted. In every selection box, one can directly jump to the term by typing the first letters. The plus button creates a route. Afterwards, the route is shown at the import and export factory. The docklands dialog shows an overview of all contracts for one island. One can switch between the dialogs by clicking on the product icons.</p>
<p>The upper part of the dialog shows the <b>export pyramid</b>. New entries are added by selecting a product and a multiplier. Rearranging the pyramid is achieved by deleting and recreating the entries. Existing contracts are updated such that the imported tons per minute remain the same.</p>
<p>The lower part of the dialog shows an overview of all contracts and summary information about the trade. First of all, one has to enter the <b>loading speed of the pier</b> where Tobias trades. The loading speed is displayed in the lower part of the pier's information panel in the game. The calculator computes the trading duration, the total stock turnover in t/min, the island's required storage capacity, and the tons one must enter for each contract. The calculation of these values includes the loading speed bonus for Tobias and the duration to enter and leave the session. In case ∞ is displayed, the entered stock turnover exceeds the maximum. Then, one must distribute the contracts over more islands, increase the loading speed or reduce the traded volume.</p>
<p>There is a second use case, where one wants to trade as many goods as possible per trade. First of all, one has to specify all the trade contracts and the loading speed. Here, the absolute amount per contract does not matter, only the relative difference between different contracts. Then, enter the total island storage capacity and click the button <b>Set total capacity</b> next to it. It determines the good that requires the maximal storage capacity c. It scales the contract by a factor f such that c matches the island storage capacity. Finally, f is applied to all other contracts.</p><p><b>All Islands</b> (selected by default, if no island management is active) behaves a bit different. It allows to <b>import and export</b> the same good so that one can aggregate the contracts of several docklands. But it does not show the summary information about the trade.</p>
<br/>

<h5>Disclaimer</h5>
<p>The calculator is provided without warranty of any kind. The work was NOT endorsed by Ubisoft Blue Byte in any kind. All the assets from Anno 1800 game are © by Ubisoft.</p><br/>
<p>These are especially but not exclusively all icons, designators, and consumption values.</p><br/>

<p>This software is under the MIT license.</p><br/>

<h5>Author</h5>
<p>Nico Höllerich</p>
<p>hoellerich.nico@freenet.de</p><br/>

<h5>Bugs and improvements</h5>
<span>If you encounter any bugs or inconveniences or if you want to suggest improvements, create an Issue on GitHub (</span><a href="https://github.com/NiHoel/Anno1800Calculator/issues">https://github.com/NiHoel/Anno1800Calculator/issues</a><span>)</span>`
    }
}

options = {
    "simpleView": {
        "name": "Simple View",
        "locaText": {
            "english": "Simple view",
            "german": "Einfache Ansicht"
        }
    },
    "decimalsForBuildings": {
        "name": "Show number of buildings with decimals",
        "locaText": {
            "english": "Show number of buildings with decimals",
            "german": "Zeige Nachkommastellen bei der Gebäudeanzahl",
            "korean": "건물 수를 소수점 단위로 표시"
        }
    },
    "hideNames": {
        "name": "Hide the names of products, factories, and population levels",
        "locaText": {
            "english": "Hide the names of products, factories, and population levels",
            "german": "Verberge die Namen von Produkten, Fabriken und Bevölkerungsstufen",
            "korean": "제품, 건물명 및 인구 이름 숨기기"
        }
    },
    "hideProductionBoost": {
        "name": "Hide the input fields for production boost",
        "locaText": {
            "english": "Hide the input fields for production boost",
            "german": "Verberge das Eingabefelder für Produktionsboosts",
            "korean": "생산성 입력 필드 숨기기"
        }
    },
    "showAllConstructableFactories": {
        "name": "Show all factories constructable in the region",
        "locaText": {
            "english": "Show all factories constructable in the region",
            "german": "Zeige alle Fabriken, die in der Region errichtet werden können"
        }
    },
    "missingBuildingsHighlight": {
        "name": "Highlight missing buildings",
        "locaText": {
            "english": "Highlight missing buildings",
            "german": "Fehlende Gebäude hervorheben",
            "korean": "부족한 건물 강조"
        }
    },
    "consumptionModifier": {
        "name": "Need Consumption",
        "dialog": "good-consumption-island-upgrade-dialog",
        "locaText": {
            "english": "Newspaper",
            //"guid": 14496,
            "polish": "Gazeta",
            "spanish": "Periódico",
            "taiwanese": "報紙",
            "german": "Zeitung",
            "chinese": "报纸",
            "italian": "Giornale",
            "korean": "신문",
            "french": "Journal",
            "japanese": "新聞",
            "russian": "Газета"
        }
    },
    "additionalProduction": {
        "name": "Extra Goods",
        "dialog": "item-equipment-dialog",
        "locaText": {
            "english": "Extra Goods",
            "chinese": "额外货物",
            "taiwanese": "額外貨物",
            "italian": "Merci aggiuntive",
            "spanish": "Bienes extra",
            "german": "Zusatzwaren",
            "polish": "Dodatkowe towary",
            "french": "Marchandises supplémentaires",
            "korean": "추가 물품",
            "japanese": "追加品物",
            "russian": "Дополнительные товары"
        }
    },
    "contracts": {
        "name": "Contracts",
        //guid: 132271
        "dialog": "contract-management-dialog",
        "locaText": {
            "english": "Docklands",
            //"guid": 410083,
            "polish": "Okno na świat",
            "spanish": "Zona portuaria",
            "taiwanese": "港灣",
            "german": "Speicherstadt",
            "chinese": "港湾",
            "italian": "Area portuale",
            "korean": "부둣가",
            "french": "Zone portuaire",
            "japanese": "港湾地区",
            "russian": "Доки"
        }
    },
    "tradeRoutes": {
        "name": "Trade Routes",
        "dialog": "trade-routes-management-dialog",
        "locaText": {
            "english": "Trade Routes",
            "chinese": "贸易航线",
            "taiwanese": "貿易航線",
            "italian": "Rotte commerciali",
            "spanish": "Rutas de comercio",
            "german": "Handelsrouten",
            "polish": "Szlaki handlowe",
            "french": "Routes commerciales",
            "korean": "무역로",
            "japanese": "取引ルート",
            "russian": "Торговые маршруты"
        }
    },
    "autoApplyExtraNeed": {
        "name": "Automatically update extra need when trade routes or extra goods change",
        "locaText": {
            "english": "Automatically update extra need when trade routes or extra goods change",
            "german": "Zusatzbedarf automatisch anpassen, wenn sich Handelsrouten oder Zusatzwaren ändern"
        }
    },
    "autoApplyConsumptionUpgrades": {
        "name": "Automatically update need consumption based on effects and newspaper",
        "locaText": {
            "english": "Automatically update need consumption based on effects and newspaper",
            "german": "Verbrauch der Bedürfnisse basierend auf Effekten und Zeitung automatisch anpassen"
        }
    },
    "needUnlockConditions": {
        "name": "Consider unlock conditions for needs",
        "locaText": {
            "english": "Consider unlock conditions for needs",
            "german": "Freischaltbedingungen der Bedürfnisse berücksichtigen",
        }
    },
    "noOptionalNeeds": {
        "name": "Do not produce luxury goods",
        "locaText": {
            "english": "Do not produce luxury goods",
            "german": "Keine Luxusgüter produzieren",
            "korean": "사치품을 생산하지 않습니다."
        }
    },
    "deriveResidentsPerHouse": {
        "name": "",
        "locaText": {
            "english": "Calculate residents per house based on the resident supply",
            "german": "Berechne die Einwohner pro Haus basierend auf der Versorgung der Einwohner"
        }
    }
}

serverOptions = {
    "populationLevelAmount": {
        "name": "PopulationLevel Amount",
        "locaText": {
            "english": "Update residents count",
            "german": "Aktualisiere Einwohneranzahl",
            "korean": "주민 수 가져오기"
        }
    },
    "populationLevelLimit": {
        "name": "PopulationLevel Limit",
        "locaText": {
            "english": "Update max. residents",
            "german": "Aktualisiere maximale Einwohnerzahl"
        }
    },
    "populationLevelExistingBuildings": {
        "name": "PopulationLevel ExistingBuildings",
        "locaText": {
            "english": "Update houses count",
            "german": "Aktualisiere Häuseranzahl",
            "korean": "주택 수 가져오기"
        }
    },
    "factoryExistingBuildings": {
        "name": "FactoryExistingBuildings",
        "locaText": {
            "english": "Update factories count",
            "german": "Aktualisiere Fabrikanzahl",
            "korean": "생산건물 수 가져오기"
        }
    },
    "factoryPercentBoost": {
        "name": "FactoryPercentBoost",
        "locaText": {
            "english": "Update productivity",
            "german": "Aktualisiere Produktivität",
            "korean": "생산성 가져오기"
        }
    },
    "optimalProductivity": {
        "name": "Optimal Productivity",
        "locaText": {
            "english": "Use the production limit to calculate optimal productivity",
            "german": "Verwende das Produktionslimit, um die optimale Produktivität zu berechnen"
        }
    },
    "updateSelectedIslandOnly": {
        "name": "Update selected islands only",
        "locaText": {
            "english": "Restrict updates to the selected island",
            "german": "Beschränke Updates auf die ausgewählte Insel",
            "korean": "선택한 섬만 가져오기"
        }
    },
    "proposeIslandNames": {
        "name": "Suggest island names encountered by the server",
        "locaText": {
            "english": "Suggest island names encountered by the server",
            "german": "Vom Server erkannte Inselnamen vorschlagen"
        }
    }
}