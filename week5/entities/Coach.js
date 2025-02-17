const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Coach",
  tableName: "COACH",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    user_id: {
      type: "uuid",
      nullable: false,
      unique: true,
    },
    experence_years: {
      type: "integer",
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    profile_image_url: {
      type: "varchar",
      length: 2048,
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    updateAt: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
  },
  relations: {
    User: {
      target: "User",
      type: "one-to-one",
      inverseSide: "Coach",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "coach_user_id_fk",
      },
    },
  },
});
