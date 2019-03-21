"# black_market_admin" 
		function Foo(){
			getName = function(){
				console.log(1);
			}
			return this
		}
		Foo.getName = function(){
			console.log(2);
		}
		Foo.prototype.getName= function(){
			console.log(3);
		};
		getName();  //undefined
		var getName = function(){
			console.log(4);
		}
		function getName(){
			console.log(5);
		}
		Foo.getName();25
		getName();42
		Foo().getName();11
		getName();41
		(new Foo).getName()13
		new Foo.getName()22