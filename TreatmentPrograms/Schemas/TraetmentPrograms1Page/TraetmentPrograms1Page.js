define("TraetmentPrograms1Page", [], function() {
	return {
		entitySchemaName: "TraetmentPrograms",
		attributes: {
			/*Атрибут, который хранит текущее количество активных ежедневных сеансов. */
			"responseTraetmentPrograms":{
				"dataValueType": Terrasoft.DataValueType.INTEGR,
				"type": Terrasoft.ViewModelColumnType.Virtual_COLUMN
			},
			/*Атрибут, который хранит значение системной настройки. */
			"maxDailyActiveSessions":{
				"dataValueType": Terrasoft.DataValueType.INTEGER,
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "TraetmentProgramsFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "TraetmentPrograms"
				}
			},
			"SessionDetail": {
				"schemaName": "Schemacfb7ff32Detail",
				"entitySchemaName": "Session",
				"filter": {
					"detailColumn": "TraetmentProgram",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"Assignant": {
				"7ad5889f-0077-43e8-b880-ff3bca35a3f1": {
					"uId": "7ad5889f-0077-43e8-b880-ff3bca35a3f1",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
		/* Запускается при загрузке схемы страницы и вызывает метод подсчета текущего количества активных ежедневных сессий и метод считываниях значений системной настройки. */
			onEntityInitialized: function(){
				this.callParent(arguments);
		        this.getPeriodicityAvtiveNumber();
				this.getMaxDailyActiveSessions();
			},
			/* Вычисляет текущее количество активных ежедневных сессий и записывает полученное значение в атрибут "responceTraetmentPrograms"*/
			getPeriodicityAvtiveNumber: function(){
				var periodicity = "Ежедневно";
				var esqPeriodicity = this.Ext.create("Terrasoft.EntitySchemaQuery",{
					rootSchemaName: "TraetmentPrograms"
				});		
				esqPeriodicity.addColumn("Title");
				var groupFilters = this.Ext.create("Terrasoft.FilterGroup");
				var filterPeriodicity = this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL, "Periodicity.Title", periodicity);
				var filterIsActive = this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL, "IsActive", true);
				groupFilters.addItem(filterPeriodicity);
				groupFilters.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
				groupFilters.addItem(filterIsActive);
				esqPeriodicity.filters.add(groupFilters);
				esqPeriodicity.getEntityCollection(function(result){
					if(!result.success){
						this.showInformationDialog("Request error");
						return;
					}
					else{
						var lengthCollection = result.collection.collection.length;
						this.set("responseTraetmentPrograms", lengthCollection);
					}
				},this);
				
			},
		
		/*Добавляет валидацию к полю "периодичность". При изщменении данного поля либо сохранении записи будет вызываться метод-валидатор*/
		setValidationConfig: function() {
			this.callParent(arguments);
			this.addColumnValidator("Periodicity", this.periodicityValidator);
		},
		/*Метод-валидатор - если секция ежедневнаяб сравнивает текущее количество активных ежедневных сессий с системной настройкой "MaxDailyActiveSessions" и в случае превышения добавляет в поле "Периодичность" предупреждающее сообщение. Сохранение записи в таком случае невозможно.*/
		periodicityValidator: function(){
			var invalidMessage="";
			var periodicity = this.get("Periodicity").displayValue;
			if (periodicity === "Ежедневно"){
				var isActive = this.get("IsActive");
				var maxDailyActiveSessions= this.get("maxDailyActiveSessions");
				var lengthCollection = this.get("responseTraetmentPrograms");
				console.log(isActive);
				console.log(maxDailyActiveSessions);
				console.log(lengthCollection);
				if (lengthCollection >= maxDailyActiveSessions && isActive){
					invalidMessage = "Количество активных сеансов ограничено. Не более "+ maxDailyActiveSessions +" активных ежедневных сеансов.";
				}
			}
			return{
				invalidMessage: invalidMessage
			};
		},
		/*Получает значение системной настройки "MaxDailyActiveSessions"*/
		getMaxDailyActiveSessions: function(){
			var maxDailyActiveSessions;
			var callback = function(value){
				maxDailyActiveSessions = value;
			};
			this.Terrasoft.SysSettings.querySysSettingsItem("MaxDailyActiveSessions", callback, this);
			if (maxDailyActiveSessions === undefined){
				return;
			}
			else{
				this.set("maxDailyActiveSessions", maxDailyActiveSessions);
			}
		
		}
	},
		
		
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "Code340f1d99-f0f3-4f18-ae88-5c9da4296b00",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "Code"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Titleb74ee487-f701-4dd8-9d63-6193953da98f",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "Title"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Assignantdc9eda61-5960-4eb6-80f4-33dadfefded4",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "Assignant"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "IsActivebdd6ef7b-3c9c-430d-9148-6816684274bb",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "IsActive"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Periodicity6c5072d1-bf49-45ea-8c85-7b2d7ff5b637",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "Periodicity",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Notes3d19a3fc-620b-4036-b101-633da02a56e8",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 3,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "Notes",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SessionDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "Notes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 1
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
