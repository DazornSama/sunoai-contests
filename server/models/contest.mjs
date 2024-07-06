const calculateIdByName = (name) => {
  const nameParts = name.replace(/[^a-zA-Z0-9 ]/g, " ").split(" ");

  const idParts = nameParts.map((p) => {
    if (isNaN(p)) {
      return p[0];
    }

    return p;
  });

  return idParts.join("").toLowerCase();
};

const escapeDescription = (description) => {
  return description
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export default class Contest {
  constructor(name, description, startDate, endDate) {
    this._id = null;
    this.id = calculateIdByName(name);
    this.name = name;
    this.description = escapeDescription(description);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  get mongoId() {
    return this._id;
  }

  set mongoId(newId) {
    this._id = newId;
  }

  isValid() {
    if (
      !this.id &&
      !this.name &&
      !this.startDate &&
      !this.endDate &&
      this.id.length <= 0 &&
      this.name.length <= 0 &&
      this.startDate.length <= 0 &&
      this.endDate.length <= 0
    ) {
      return false;
    }

    if (isNaN(new Date(this.startDate)) || isNaN(new Date(this.endDate))) {
      return false;
    }

    return true;
  }

  toMongo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      start_date: this.startDate,
      end_date: this.endDate,
    };
  }
}

export const ContestFromMongo = (document) => {
  const contest = new Contest(
    document.name,
    document.description,
    document.start_date,
    document.end_date
  );

  contest.mongoId = document._id;

  return contest;
};
