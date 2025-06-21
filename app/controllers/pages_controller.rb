class PagesController < ApplicationController
  def home
    featured_artists = DataService.artists.sample(6)
    latest_videos = DataService.videos.last(3)
    
    render inertia: 'Home', props: {
      featured_artists: featured_artists,
      latest_videos: latest_videos
    }
  end

  def test
    render inertia: 'Test'
  end

  def inertia_example
  render inertia: 'InertiaExample', props: {
    name: 'Neokizfest Developer'
  }
  end

  def lineup
    artists = DataService.artists
    
    render inertia: 'Lineup', props: {
      artists: artists
    }
  end

  def videos
    videos = DataService.videos
    
    render inertia: 'Videos', props: {
      videos: videos
    }
  end

  def testimonials
    testimonials = DataService.testimonials
    
    render inertia: 'Testimonials', props: {
      testimonials: testimonials
    }
  end
end
