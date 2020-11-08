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
    producedAmount: {
        english: "Plain building output after taking extra goods into account",
        german: "Reiner Gebäudeoutput nach Berücksichtigung von Zusatzwaren",
    },
    showIslandOnCreation: {
        english: "After creating a new island display it",
        german: "Nach dem Erstellen einer neuen Insel zeige diese an"
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
        english: "Game Update 9 - Land of Lions",
        german: "Game Update 9 - Land der Löwen",
        korean: "게임 업데이트 9 - 사자의 땅"
    },
    helpContent: {
        german:
            `Verwendung: Trage die aktuellen oder angestrebten Einwohner pro Stufe in die oberste Reihe ein. Die Produktionsketten aktualisieren sich automatisch sobald man die Eingabe verlässt. Es werden nur diejenigen Fabriken angezeigt, die benötigt werden.

Der Buchstabe in eckigen Klammern vor dem Bevölkerungsnamen ist der Hotkey zum Fokussieren des Eingabefeldes. Die Anzahl dort kann ebenfalls durch Drücken der Pfeiltasten erhöht und verringert werden.

In der darunterliegenden Reihe wird die Arbeitskraft angezeigt, die benötigt wird, um alle Gebäude zu betreiben (jeweils auf die nächste ganze Fabrik gerundet).

Danach folgen zwei große Abschnitte, die sich wiederum in Unterabschnitte unterteilen. Der erste gibt einen Überblick über alle benötigten Gebäude, sortiert nach dem produzierten Warentyp. Der zweite schlüsselt die einzelnen Produktionsketten nach Bevölkerungsstufen auf. Jeder der Abschnitte kann durch einen Klick auf die Überschrift zusammengeklappt werden. Durch das Abwählen des Kontrollkästchens wird das entsprechende Bedürfnis von der Berechnung ausgenommen.

In jeder Kachel wird der Name der Fabrik, das Icon der hergestellten Ware, der Boost für den Gebäudetyp, die Anzahl der benötigten Gebäude und die Produktionsrate in Tonnen pro Minute angezeigt. Die Anzahl der Gebäude wird mit zwei Nachkommastellen angezeigt, um die Höhe der Überkapazitäten direkt ablesen zu können. Daneben befinden sich zwei Buttons. Diese versuchen den Boost so einzustellen, dass alle Gebäude des Typs bestmöglich ausgelastet sind und dabei ein Gebäude mehr (+) bzw. eines weniger (-) benötigt wird.

Da Baumaterialien sich Zwischenmaterialien mit Konsumgütern teilen sind sie (im Gegensatz zu Warenrechnern früherer Annos) mit aufgeführt, um so den Verbrauch von Minen besser planen zu können. Es muss die Anzahl der Endbetriebe per Hand eingegeben werden.

Über das Zahnrad am rechten oberen Bildschirmrand gelangt man zu den Einstellungen. Dort können die Sprache ausgewählt und die Menge der dargestellten Informationen angepasst werden.

Über die drei Zahnräder neben dem Einstellungsdialog öffnet sich der Dialog zur Modifikation der Produktionsketten. In der oberen Hälfte kann die Fabrik ausgewählt werden, die die dargestellte Ware herstellen soll. In der unter Hälfte können Spezialisten aktiviert werden, welche die Eingangswaren der Fabriken verändern. Standardmäßig ist die Gleiche-Region-Regel eingestellt. Exemplarisch besagt diese, dass das Holz für die Destillerien in der Neuen Welt, das Holz für Nähmaschinen aber in der Alten Welt produziert wird.

Über den Downloadbutton kann dieser Rechner sowie eine zusätzliche Serveranwendung heruntergeladen werden. Mit der Serveranwendung lassen sich die Bevölkerungszahlen automatisch aus dem Spiel auslesen. Ich danke meinem Kollegen Josua Bloeß für die Umsetzung.

Haftungsausschluss:
Der Warenrechner wird ohne irgendeine Gewährleistung zur Verfügung gestellt. Die Arbeit wurde in KEINER Weise von Ubisoft Blue Byte unterstützt. Alle Assets aus dem Spiel Anno 1800 sind © by Ubisoft.
Dies sind insbesondere, aber nicht ausschließlich alle Icons der Bevölkerung, Waren und Gegenstände sowie die Daten der Produktionsketten und die Verbrachswerte der Bevölkerung.

Diese Software steht unter der MIT-Lizenz.


Autor:
Nico Höllerich

Fehler und Verbesserungen:
Falls Sie auf Fehler oder Unannehmlichkeiten stoßen oder Verbesserungen vorschlagen möchten, erstellen Sie ein Issue auf GitHub (https://github.com/NiHoel/Anno1800Calculator/issues)`,

        english:
            `Usage: Enter the current or desired number of residents per level into the top most row. The production chains will update automatically when one leaves the input field. Only the required factories are displayed.

The letter in square brackets before the resident's name is the hotkey to focus the input field. There, one can use the arrow keys to inc-/decrement the number.

The row below displays the workforce that is required to run all buildings (rounded towards the next complete factory).

Afterwards two big sections follow that are subdivided into smaller sections. The first one gives an overview of the required buildings sorted by the type of good that is produced. The second one lists the individual production chains for each population level. Clicking the heading collapses each section. Deselecting the checkbox leads to the need being excluded from the calculation.

Each card displays the name of the factory, the icon of the produced good, the boost for the given type of building, the number of required buildings, and the production rate in tons per minute. The number of buildings has two decimal places to directly show the amount of overcapacities. There are two buttons next to it. Those try to adjust the boost such that all buildings operate at full capacity and one more (+) or one building less (-) is required.

Since construction materials share intermediate products with consumables they are explicitly listed (unlike in calculators for previous Annos) to better plan the production of mines. The number of factories must be entered manually.

When clicking on the cog wheel in the upper right corner of the screen the settings dialog opens. There, one can chose the language, give the browser tab a name and customize the information presented by the calculator.

The three cog wheels next to the settings dialog open a dialog to modify the production chains. In the upper part, the factory can be chosen to produce the noted product. In the lower part, specialists that change the input for factories can be applied. By default, the same region policy is selected. By example, this means that the wood for desitilleries is produced in the New World while the wood for sewing machines is produced in the Old World.

Pressing the download button one can download the configuration, this calculator and an additional server application. The server application automatically reads the population count from the game. I thank my colleague Josua Bloeß for the implementation.

Disclaimer:
The calculator is provided without warranty of any kind. The work was NOT endorsed by Ubisoft Blue Byte in any kind. All the assets from Anno 1800 game are © by Ubsioft.
These are especially but not exclusively all the icons of population, goods and items and the data of production chains and the consumptions values of population.

This software is under the MIT license.


Author:
Nico Höllerich

Bugs and improvements:
If you encounter any bugs or inconveniences or if you want to suggest improvements, create an Issue on GitHub (https://github.com/NiHoel/Anno1800Calculator/issues)`,

        korean:
            `사용법 : 레벨 당 현재 또는 원하는 주민 수를 최상위 행에 입력하십시오. 
주민 이름 앞에 사각 괄호 안에 있는 알파벳은 입력필드 단축키 입니다. 그곳에 화살표 키를 사용해서 인구를 줄이거나 높일 수 있습니다.

생산 체인은 입력 필드를 벗어나면 자동으로 업데이트됩니다. 필요한 건물만 표시됩니다.
아래 행에는 모든 건물을 운영하는 데 필요한 인력이 표시됩니다 (다음 완전한 공장으로 반올림).
그 후 두 개의 큰 섹션이 이어지고 더 작은 섹션으로 세분됩니다. 첫 번째는 필요한 건물의 유형을 생산 된 제품 유형별로 정렬하여 보여줍니다. 
두 번째는 각 인구 수준에 대한 개별 생산 체인을 나열합니다. 제목을 클릭하면 각 섹션이 축소됩니다. 네모 확인란을 선택 취소하면 계산에서 제외됩니다. 
각 카드에는 건물 이름, 생산 된 제품의 아이콘, 건물 유형에 대한 생산성, 필요한 건물 수 및 분당 생산률이 표시됩니다. 
건물 수에는 과잉 용량을 직접 표시하기 위해 소수점 이하 두 자리로 표시되어 있습니다. 그리고 우측에 두 개의 버튼이 있습니다. 모든 건물이 최대 용량으로 작동하고 한 개 이상 (+) 또는 한 개 미만 (-)이 필요하도록 생산성 조정을 시도합니다.
건설재는 소모품과 중간 제품을 공유하므로 광산 생산 계획을 개선하기 위해 명시 적으로 표시됩니다. 팩토리 수는 수동으로 입력해야합니다.

화면 오른쪽 상단에있는 톱니 바퀴를 클릭하면 설정 대화 상자가 열립니다. 거기에서 언어를 선택하고 브라우저 탭에 이름을 지정하고 Anno1800 계산기가 제공하는 정보를 사용자 정의 할 수 있습니다.
설정 대화 상자 옆에있는 3 개의 톱니 바퀴는 생산 체인을 수정하는 대화 상자를 엽니다. 상단에는 제품을 생산하기 생산건물의 지역을 선택할 수 있습니다. 하단에는 생산건물의 생산성을 변경하는 전문가를 적용할 수 있습니다. 
기본값은 소비자와 동일한 지역 정책이 선택됩니다. 예를 들어, 이는 데시 빌리 용 목재가 신세계에서 생산되고 재봉틀 용 목재는 구세계에서 생산됨을 의미합니다.

다운로드 버튼을 누르면 설정,Anno1800 계산기 및 추가 서버 프로그램을 다운로드 할 수 있습니다. 
서버 프로그램은 게임의 통계 메뉴에서 인구, 생산 및 재정-생산 건물을 자동으로 가져옵니다. 구현에 도움을 준 동료 Josua Bloeß에게 감사드립니다.

추신:
Anno1800 계산기는 어떠한 종류의 보증도 제공되지 않습니다. 이 프로그램은 Ubisoft Blue Byte가 어떤 종류의 보증도 하지 않았습니다. Anno 1800 게임의 모든 것은 Ubsioft의 자산 입니다.
특히 인구, 상품 및 품목의 아이콘과 생산 체인 데이터 및 인구의 소비 가치를 모두 포함하는 것은 아닙니다.
이 소프트웨어는 MIT 에게 라이센스가 있습니다.

개발자:
Nico Höllerich
버그 및 개선 사항 :
버그 나 불편한 점이 있거나 개선을 제안하려면 GitHub (https://github.com/NiHoel/Anno1800Calculator/issues)에 문의하십시오`
    }
}

options = {
    "existingBuildingsInput": {
        "name": "Input number of houses instead of residents",
        "locaText": {
            "english": "Input number of houses instead of residents",
            "german": "Gib Anzahl an Häusern anstelle der Einwohner ein",
            "korean": "주민 수 대신 주택 수를 입력"
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
    "decimalsForBuildings": {
        "name": "Show number of buildings with decimals",
        "locaText": {
            "english": "Show number of buildings with decimals",
            "german": "Zeige Nachkommastellen bei der Gebäudeanzahl",
            "korean": "건물 수를 소수점 단위로 표시"
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
    "additionalProduction": {
        "name": "Show input field for additional production",
        "locaText": {
            "english": "Show input field for additional production (negative values possible)",
            "german": "Zeige Eingabefeld für Zusatzproduktion (negative Werte möglich)",
            "korean": "추가 생산을 위한 입력 필드 표시 (음수 값 가능)"
        }
    },
    "consumptionModifier": {
        "name": "Show input field for percental consumption modification",
        "locaText": {
            "english": "Show input field for percental consumption modification",
            "german": "Zeige Eingabefeld für prozentuale Änderung des Warenverbrauchs",
            "korean": "소비 수정(백분율)을 위한 입력 필드 표시"
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
    "hideNewWorldConstructionMaterial": {
        "name": "Hide factory cards for construction material not produced in Europe",
        "locaText": {
            "english": "Hide factory cards for construction material not produced in Europe",
            "german": "Verberge die Fabrikkacheln für Baumaterial, das nicht in Europa produziert wird",
            "korean": "새로운 지역(북극)에서 생산되는 건축 자재 숨기기"
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
    /*    "optimalProductivity": {
            "name": "Optimal Productivity",
            "locaText": {
                "english": "Read maximum possible productivity instead of current average",
                "german": "Lies best mögliche Produktivität anstelle des gegenwärtigen Durchschnitts aus",
                "korean": "평균 대신 최대 생산성을 가져오기"
            }
        }, */
    "updateSelectedIslandOnly": {
        "name": "Update selected islands only",
        "locaText": {
            "english": "Restrict updates to the selected island",
            "german": "Beschränke Updates auf die ausgewählte Insel",
            "korean": "선택한 섬만 가져오기"
        }
    }
}