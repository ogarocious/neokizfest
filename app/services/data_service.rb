class DataService
  def self.artists
    @artists ||= JSON.parse(File.read(Rails.root.join('app/data/artists.json')))['artists']
  end

  def self.videos
    @videos ||= JSON.parse(File.read(Rails.root.join('app/data/videos.json')))['videos']
  end

  def self.testimonials
    @testimonials ||= JSON.parse(File.read(Rails.root.join('app/data/testimonials.json')))['testimonials']
  end

  # Clear cache when data changes (useful for development)
  def self.reload!
    @artists = nil
    @videos = nil
    @testimonials = nil
  end
end
