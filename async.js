function async(gen) {
	let args = new Array(arguments.length - 1);
	for (let i = 0; i < args.length; ++i) {
		args[i] = arguments[i + 1]
	}
	const iterator = gen.apply(null, args);
	
	function handle(iteratorResult) {
		if (iteratorResult.done) {
			return;
		}
		let iteratorValue = iteratorResult.value
		if (iteratorValue instanceof Promise) {
			iteratorValue.then(res => handle(iterator.next(res)))
						 .catch(err => iterator.throw(err));
		}
	}
	
	try {
		handle(iterator.next());
	} catch (e) {
		iterator.throw(e);
	}
}