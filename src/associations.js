import { User } from "./users/user.model.js";
import { Report } from "./reports/report.model.js";
import { Zone } from "./zones/zone.model.js";
import { Comment } from "./comments/comment.model.js";
import { Rating } from "./ratings/rating.model.js";
import { CommentReaction } from "./comments/commentReaction.model.js";
import { ReportReaction } from "./reports/reportReaction.model.js";

export const setupAssociations = () => {
    User.hasMany(Report, { foreignKey: "user_id" });
    Report.belongsTo(User, { foreignKey: "user_id" });

    Zone.hasMany(Report, { foreignKey: "zone_id", as: "reports" });
    Report.belongsTo(Zone, { foreignKey: "zone_id" });

    User.hasMany(Rating, { foreignKey: "user_id", as: "ratings" });
    Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });

    Zone.hasMany(Rating, { foreignKey: "zone_id", as: "ratings" });
    Rating.belongsTo(Zone, { foreignKey: "zone_id", as: "zone" });

    Report.hasMany(Comment, { foreignKey: "report_id" });
    Comment.belongsTo(Report, { foreignKey: "report_id" });

    User.hasMany(Comment, { foreignKey: "user_id" });
    Comment.belongsTo(User, { foreignKey: "user_id" });

    Report.hasMany(Rating, { foreignKey: "report_id" });
    Rating.belongsTo(Report, { foreignKey: "report_id" });

    User.hasMany(Rating, { foreignKey: "user_id" });
    Rating.belongsTo(User, { foreignKey: "user_id" });

    Comment.hasMany(CommentReaction, { foreignKey: "comment_id", onDelete: "CASCADE" });
    CommentReaction.belongsTo(Comment, { foreignKey: "comment_id" });

    User.hasMany(CommentReaction, { foreignKey: "user_id", onDelete: "CASCADE" });
    CommentReaction.belongsTo(User, { foreignKey: "user_id" });

    Comment.hasMany(Comment, {
        as: 'replies',
        foreignKey: 'parent_id',
        onDelete: 'CASCADE'
    });

    Comment.belongsTo(Comment, {
        as: 'parent',
        foreignKey: 'parent_id'
    });

    Report.hasMany(ReportReaction, { foreignKey: "report_id", as: "report_reactions" });
    ReportReaction.belongsTo(Report, { foreignKey: "report_id" });
};