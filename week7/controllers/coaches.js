const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Coaches");

const { isNotValidString } = require("../utils/validators");

const getAll = async (req, res, next) => {
  const { per = 0, page = 1 } = req.query;
  try {
    const coaches = await dataSource.getRepository("Coach").find({
      select: {
        id: true,
        User: {
          name: true, // only select the name from User
        },
      },
      relations: ["User"],
      skip: per > 0 ? (page - 1) * per : 0,
      take: per > 0 ? per : undefined,
    });

    const transformedData = coaches.map((coach) => ({
      id: coach.id,
      name: coach.User.name,
    }));

    return res.json({
      status: "success",
      data: transformedData,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const getCoachDetail = async (req, res, next) => {
  const { coachId } = req.params;
  try {
    if (isNotValidString(coachId)) {
      logger.warn("欄位未填寫正確");
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }

    const coaches = await dataSource.getRepository("Coach").find({
      select: {
        id: true,
        user_id: true,
        experience_years: true,
        description: true,
        profile_image_url: true,
        created_at: true,
        updated_at: true,
        User: {
          name: true,
          role: true,
        },
      },
      where: {
        id: coachId,
      },
      relations: ["User"],
    });

    if (coaches.length < 1) {
      logger.warn("找不到該教練");
      return res.status(400).json({
        status: "failed",
        message: "找不到該教練",
      });
    }

    const transformedData = coaches.map((coach) => ({
      user: {
        name: coach.User.name,
        role: coach.User.role,
      },
      coach: {
        id: coach.id,
        user_id: coach.user_id,
        experience_years: coach.experience_years,
        description: coach.description,
        profile_image_url: coach.profile_image_url,
        created_at: coach.created_at,
        updated_at: coach.updated_at,
      },
    }));

    return res.json({
      status: "success",
      data: transformedData,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  getAll,
  getCoachDetail,
};
