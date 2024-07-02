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

export default class Contest {
  constructor(name, description, startDate, endDate) {
    this._id = null;
    this.id = calculateIdByName(name);
    this.name = name;
    this.description = description;
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
    return (
      this.id && this.name && this.description && this.startDate && this.endDate
    );
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
