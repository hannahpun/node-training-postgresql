const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Course",
  tableName: "COURSE",
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
      foreignKey: {
        name: "course_user_id_fkey",
        columnNames: ["user_id"],
        referencedTableName: "USER",
        referencedColumnNames: ["id"],
      },
    },
    skill_id: {
      type: "uuid",
      nullable: false,
      foreignKey: {
        name: "course_skill_id_fkey",
        columnNames: ["skill_id"],
        referencedTableName: "SKILL",
        referencedColumnNames: ["id"],
      },
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    start_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    end_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    max_participants: {
      type: "integer",
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
});
