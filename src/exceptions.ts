class LitivoException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LitivoException";
    }
}

class DraftCreationException extends LitivoException {
    constructor(message: string) {
        super(message);
        this.name = "DraftCreationException";
    }
}
class DraftDeletionException extends LitivoException {
    constructor(message: string) {
        super(message);
        this.name = "DraftDeletionException";
    }
}

class MoreThanOneDraftWithTheSameDebtorException extends LitivoException {
    constructor(message: string) {
        super(message);
        this.name = "MoreThanOneDraftWithTheSameDebtorException";
    }
}

class DebtorAlreadyHasProcessException extends LitivoException {
    constructor(message: string) {
        super(message);
        this.name = "DebtorAlreadyHasProcessException";
    }
}
export { DebtorAlreadyHasProcessException, DraftCreationException, DraftDeletionException, LitivoException, MoreThanOneDraftWithTheSameDebtorException };

