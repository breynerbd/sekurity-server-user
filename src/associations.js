import { User } from "./users/user.model.js";
import { Report } from "./reports/report.model.js";
import { Zone } from "./zones/zone.model.js";
import { Comment } from "./comments/comment.model.js";
import { Rating } from "./ratings/rating.model.js";

export const setupAssociations = () => {

    // USER -> REPORT
    User.hasMany(Report, { foreignKey: "user_id" });
    Report.belongsTo(User, { foreignKey: "user_id" });


    // ZONE -> REPORT
    Zone.hasMany(Report, { foreignKey: "zone_id" });
    Report.belongsTo(Zone, { foreignKey: "zone_id" });


    // REPORT -> COMMENT
    Report.hasMany(Comment, { foreignKey: "report_id" });
    Comment.belongsTo(Report, { foreignKey: "report_id" });


    // USER -> COMMENT
    User.hasMany(Comment, { foreignKey: "user_id" });
    Comment.belongsTo(User, { foreignKey: "user_id" });


    // REPORT -> RATING
    Report.hasMany(Rating, { foreignKey: "report_id" });
    Rating.belongsTo(Report, { foreignKey: "report_id" });


    // USER -> RATING
    User.hasMany(Rating, { foreignKey: "user_id" });
    Rating.belongsTo(User, { foreignKey: "user_id" });

};