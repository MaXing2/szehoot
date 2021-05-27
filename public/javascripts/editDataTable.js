	$(document).ready(function() {
		$('#example').DataTable({
			"oLanguage": {
				"oPaginate": {
					"sFirst": "Első oldal",
					"sPrevious": "Előző",
					"sNext": "Következő",
					"sLast": "Utolsó oldal"
					},
				"sSearch": "",
				"sSearchPlaceholder": "Keresés...",
				"sInfoEmpty": "Nincs rekord a táblázatban!",
				"sInfo": "",
				"sZeroRecords": "Nincs találat",
				"sLengthMenu": "_MENU_",
				"sInfoFiltered": "",
				"sEmptyTable": "Nincs rekord a táblázatban!"
			},
			responsive: true,



					responsive: {
						details: {
							type: 'column'
						}
					},
					columnDefs: [ {
						className: 'dtr-control',
						orderable: false,
						targets:   0
					} ],
					order: [ 1, 'asc' ]
				} 


		});


	});