INSERT INTO users(name, email, password) VALUES
  ('SHU SHAN MOUNT', 'sue@san.mount', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('nomral name', 'moral@mane.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('KING OF FOOD', 'food@jellybean.mountain', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.')
;
INSERT INTO properties(
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active
) VALUES (
  1,
  'MOUNTAIN SHU',
  'description',
  'blah@blah.png',
  'mount@blah.png',
  1900,
  0,
  0,
  0,
  'China',
  'mountain street',
  'Guilin',
  'Guilin',
  'none',
  TRUE
), (
    1,
  'MOUNTAIN SHAN',
  'description',
  'wow@wow.png',
  'bigboi@blah.png',
  30000000,
  100,
  0,
  0,
  'Indonesia',
  'mountain road',
  'Jakarta',
  'Jakarta',
  '1V39M9',
  FALSE
), (
  3,
  'Dennys on Marine',
  'description',
  'wow@wow.png',
  'bigboi@blah.png',
  10,
  15,
  2,
  0,
  'Canada',
  'Marine Street',
  'Vancouver',
  'British Columbia',
  '1V39M9',
  TRUE
);

INSERT INTO reservations(
  start_date, end_date, property_id, guest_id
  ) VALUES 
  ('2019-01-04', '2019-02-01', 1, 2),
  ('2018-01-04', '2018-02-01', 1, 2),
  ('2017-01-04', '2017-02-01', 1, 2),
  ('2016-01-04', '2016-02-01', 1, 2),
  ('2019-05-04', '2019-07-01', 3 , 2),
  ('2019-01-04', '2019-02-01', 2 , 1)
;

INSERT INTO property_reviews(
  guest_id, property_id, reservation_id, rating, message
  ) VALUES 
  (2, 1, 4, 5, 'BEST MOUNTAIN EVER'),
  (2, 1, 1, 1, 'Mountain is not the same'),
  (2, 3, 5, 1, 'This is just a Dennys. I wish I was at the mountain.');

  