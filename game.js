


let game_data;

let current_room = 0;
let items_picked = [];

function readAction ()
{
	let instruction = document.getElementById("commands").value;
	let instruction_trim = instruction.trim();

	let data = instruction_trim.split(" ");

	if (data.length == 0 || instruction_trim == ""){
		terminal_out("<p><strong>Error</strong>: escribe una instrucción</p>");
		return;
	}

	if (data.length == 1){
		parseCommand(data[0]);
	}
	else{
		parseInstruction(data);
	}

}



function terminal_out (info)
{
	let terminal = document.getElementById("terminal");

	terminal.innerHTML += info;

	terminal.scrollTop = terminal.scrollHeight;
}




function getRoomNumber (room)
{
	for (let i = 0; i < game_data.rooms.length; i++){
		if (game_data.rooms[i].id == room){
			return i;
		}
	}

	return -1;
}

function getDoorNumber (door)
{
	for (let i = 0; i < game_data.doors.length; i++){
		if (game_data.doors[i].id == door){
			return i;
		}
	}

	return -1;
}

function parseCommand (command)
{
	console.log("El comando ", command);
	switch (command){
		case 'ver':
			terminal_out("<p>"+game_data.rooms[current_room].description+"</p>");
			break;

		case 'ir':
			let doors = "";
			let doors_num = game_data.rooms[current_room].doors.length;
			for (let i = 0; i < doors_num; i++){
				doors += game_data.rooms[current_room].doors[i]+", ";
			}
			terminal_out("<p>Puedes ir a: "+doors+"</p>");
			break;
		
		case 'coger':
			
			let items = "";
			let num = game_data.rooms[current_room].items.length;
			for (let i = 0; i < num; i++){
				items += game_data.rooms[current_room].items[i] + " ";
			}
			
			terminalOut("<p>Los objetos de la habitacion son: "+items+"</p>");
			
			break;
			
		case "inventario":
		
			let inventory = "";
			let inventory_cap = items_picked.length;
			
			for (let i = 0; i < inventory_cap; i++) {
				inventory += items_picked[i] + " ";
			}
			
			terminalOut("<p>Tu inventario coontiene: "+inventory+"</p>");
		
			break;

		default:
			terminal_out("<p><strong>Error</strong>: "+command+" commando no encontrado</p>");


	}
}

function parseInstruction (instruction)
{

	console.log("La instrucción ", instruction);

	switch (instruction[0]){
		case 'ver':

			break;

		case 'ir':
			
			let door_num = getDoorNumber(instruction[1]);
			if (door_num < 0){
				console.log("No puedes ir a esa puerta");
				return;
			}

			let room_num = getRoomNumber(game_data.doors[door_num].rooms[0]);
			if (door_num < 0){
				console.log("No puedes ir a la habitacion");
				return;
			}
			
			if (room_num == current_room){
				current_room = getRoomNumber(game_data.doors[door_num].rooms[1]);
			}
			else{
				current_room = room_num;
			}

			break;

		case 'coger':
			
			game_data.rooms[current_room].items.forEach(function (item) {
				if (item == instruction[1]) {
				
					let item_num = game_data.rooms[current_room].items.indexOf(item);
					
					if (item_num < 0) {
						console.log("Error al borrar el item de la habitación");
						return;
					}
					
					item_num = findItemNumber(item);
					console.log(game_data.items[item_num]);

					if (game_data.items[item_num].pickable == false) {
						terminalOut("<p>El objeto<strong> " + item + "</strong> no puede ser cogido</p>");
						return;
					}
					
					game_data.rooms[current_room].items.forEach(item => {
						if (item == instruction[1]) {
							items_picked.push(game_data.rooms[current_room].items.splice(item_num, 1));
						}
					});
					
					terminalOut("<p>El objeto<strong> " + item + "</strong> ha sido añadido a tu inventario</p>");
					return;
				}
			});
		
			break;


		default:
			terminal_out("<p><strong>Error</strong>: "+instruction[0]+" commando no encontrado</p>");
	}
}

function game (data)
{
	game_data = data;
	
	document.getElementById("terminal").innerHTML = "<p><strong>¡Bienvenidos a ENTIerrame!</strong> El juego de terror definitivo.</p>";
	document.getElementById("terminal").innerHTML += "<p>Te encuentras en "+game_data.rooms[current_room].name+". ¿Qué quieres hacer?</p>";
}


fetch("https://leipos74.github.io/game.json").then(response => response.json()).then(data => game(data));


