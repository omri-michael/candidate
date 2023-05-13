CREATE TABLE `files`
(
    `id`           INT(10)       NOT NULL AUTO_INCREMENT,
    `url`          VARCHAR(1000) NOT NULL,
    `name`         VARCHAR(500)  NOT NULL,
    `file`         BLOB          NOT NULL,
    `copyNumber`   INT(10)       NOT NULL,
    `dateAdded`    DATETIME      NULL DEFAULT NULL,
    `dateModified` DATETIME      NULL DEFAULT NULL,
    PRIMARY KEY (`name`) USING BTREE,
    UNIQUE (`id`, `name`)
)