-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.auth_id_unique` TO `User_auth_id_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.email_unique` TO `User_email_key`;
