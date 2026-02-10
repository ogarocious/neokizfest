class PagesController < ApplicationController
  # ==================== REFUND SYSTEM PAGES ====================

  def farewell
    render inertia: 'Farewell'
  end

  def refund_request
    render inertia: 'RefundRequest'
  end

  def confirmation
    render inertia: 'Confirmation'
  end

  def faq
    render inertia: 'FAQ'
  end

  def status
    render inertia: 'StatusLookup'
  end

  def support
    render inertia: 'Support'
  end

  def behind_the_build
    render inertia: 'BehindTheBuild'
  end

  # Note: progress action moved to RefundProgressController for Notion integration

  # ==================== LEGACY FESTIVAL PAGES ====================

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
